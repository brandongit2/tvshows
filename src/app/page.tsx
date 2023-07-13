import {PrismaClient} from "@prisma/client"
import {load} from "cheerio"

import type {TmdbSearchTv, TmdbTvSeriesDetails} from "@/types/tmdb"
import type {ReactElement} from "react"

import EpisodeTable from "./EpisodeTable"
import {altShowTitles, showPrereqs} from "@/info"
import {tmdbApi} from "@/utils/api"

const prisma = new PrismaClient()

const getImdbData = async () => {
	const res = await fetch(`https://www.imdb.com/chart/toptv/`)
	const data = await res.text()
	return data
}

export default async function Home(): Promise<ReactElement | null> {
	const imdbData = await getImdbData()

	const $ = load(imdbData)
	const listElements = $(`.titleColumn > a, a.ipc-title-link-wrapper`)

	const shows: TmdbTvSeriesDetails[] = []
	for await (const element of listElements) {
		const imdbId = $(element).attr(`href`)?.split(`/`)[2].trim()
		if (!imdbId) continue
		let showTitle = $(element)
			.text()
			.replace(/[0-9]+\. /, ``)
		if (showTitle in altShowTitles) showTitle = altShowTitles[showTitle]

		const show = await prisma.shows.findUnique({where: {imdb_id: imdbId}, select: {details: true}})
		if (show) {
			shows.push(JSON.parse(show.details) as TmdbTvSeriesDetails)
		} else {
			const tmdbResult = await tmdbApi<TmdbSearchTv>(`search/tv?query=${showTitle}`)
			for (const result of tmdbResult.results) {
				try {
					const details = await tmdbApi<TmdbTvSeriesDetails>(`tv/${result.id}`)
					await prisma.shows.create({data: {tmdb_id: result.id, imdb_id: imdbId, details: JSON.stringify(details)}})
					shows.push(details)
					break
				} catch {}
			}
		}
	}

	// Fetch preqrequisite shows, if they aren't already in the list
	for (const show of Object.values(showPrereqs)) {
		if (!shows.find((s) => s.id === show)) {
			const details = await tmdbApi<TmdbTvSeriesDetails>(`tv/${show}`)
			shows.push(details)
		}
	}

	const showProgresses = shows.map((show) => ({
		seasons: show.seasons.filter((season) => season.season_number !== 0).map((season) => season.episode_count),
		started: false,
	}))
	const episodeTable = Array<string[]>(shows.length)
		.fill([])
		.map(() => [] as string[])
	for (let cycle = 0; true; cycle++) {
		let showsInProgress = []
		// Find seasons currently active
		for (let s = 0; s < shows.length && showsInProgress.length < 7; s++) {
			const currentSeason = showProgresses[s].seasons.findIndex((season) => season > -10000)
			const episodesLeft = showProgresses[s].seasons[currentSeason]
			if (showProgresses[s].started && currentSeason !== -1 && episodesLeft > 0) showsInProgress.push(s)
		}
		// Find started shows to resume at next season
		for (let s = 0; s < shows.length && showsInProgress.length < 7; s++) {
			const lastSeason = showProgresses[s].seasons.findIndex((season) => season > -10000)
			const nextSeason = lastSeason + 1
			if (showProgresses[s].started && showProgresses[s].seasons[lastSeason] < -2) {
				showProgresses[s].seasons[lastSeason] = -Infinity
				if (nextSeason <= shows[s].seasons.at(-1)!.season_number) showsInProgress.push(s)
			}
		}
		// Find new shows to start
		for (let s = 0; s < shows.length && showsInProgress.length < 7; s++) {
			if (!showProgresses[s].started) {
				if (shows[s].id in showPrereqs) {
					const prereq = showPrereqs[shows[s].id]
					const prereqPos = shows.findIndex((show) => show.id === prereq)
					const isPrereqStarted = showProgresses[prereqPos].started
					const isPrereqFinished =
						showProgresses[prereqPos].seasons.slice(0, -1).every((season) => season === -Infinity) &&
						showProgresses[prereqPos].seasons.at(-1)! <= 0
					if (isPrereqStarted) continue
					if (!isPrereqFinished) {
						showProgresses[prereqPos].started = true
						showsInProgress.push(prereqPos)
						continue
					}
				}
				showProgresses[s].started = true
				showsInProgress.push(s)
			}
		}
		if (showsInProgress.length === 0) break

		for (let s = 0; s < shows.length; s++) {
			if (!showsInProgress.includes(s)) {
				if (
					showProgresses[s].seasons.slice(0, -1).every((season) => season === -Infinity) &&
					showProgresses[s].seasons.at(-1)! <= 0
				) {
					episodeTable[s][cycle] = `black`
				} else if (showProgresses[s].started) {
					episodeTable[s][cycle] = `gray`
					showProgresses[s].seasons[showProgresses[s].seasons.findIndex((season) => season > -10000)]--
				} else {
					episodeTable[s][cycle] = `black`
				}
				continue
			}

			const showProgress = showProgresses[s]
			const currentSeason = showProgress.seasons.findIndex((season) => season > -10000)
			if (currentSeason === -1) {
				episodeTable[s][cycle] = `black`
				continue
			}
			const episodesLeft = showProgress.seasons[currentSeason]
			showProgresses[s].seasons[currentSeason]--

			if (episodesLeft > 0) episodeTable[s][cycle] = `limegreen`
			else if (episodesLeft > -10000) episodeTable[s][cycle] = `gray`
		}
	}

	return (
		<div className="grid grid-cols-[10rem,1fr]">
			<div className="bg-white text-right">
				{episodeTable.map((episodes, i) => (
					<p key={shows[i].id} className="overflow-hidden text-ellipsis whitespace-nowrap px-2 text-xs">
						{shows[i].name}
					</p>
				))}
			</div>
			<EpisodeTable table={episodeTable} />
		</div>
	)
}
