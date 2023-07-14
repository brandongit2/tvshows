"use client"

import {useWindowScroll, useWindowSize} from "react-use"

import type {TmdbTvSeriesDetails} from "@/types/tmdb"
import type {ReactElement} from "react"

import EpisodeTableOverlay from "./EpisodeTableOverlay"
import {useIsBrowser} from "@/util"

const cellSize = 16

export type EpisodeTableProps = {
	table: Array<Array<string | null>>
	shows: TmdbTvSeriesDetails[]
}

export default function EpisodeTable({table, shows}: EpisodeTableProps): ReactElement | null {
	const width = table[0]?.length || 0
	const height = table.length

	const {x, y} = useWindowScroll()

	const {width: windowWidth, height: windowHeight} = useWindowSize(1024, 1024)
	const xMin = Math.max(0, Math.floor(x / cellSize) - 10)
	const xMax = Math.min(width, Math.ceil((x + windowWidth) / cellSize) + 10)
	const yMin = Math.max(0, Math.floor(y / cellSize) - 10)
	const yMax = Math.min(height, Math.ceil((y + windowHeight) / cellSize) + 10)

	const isBrowser = useIsBrowser()

	return (
		<>
			<div className="sticky top-0 z-10 grid w-max grid-flow-col text-center text-xs">
				<div className="w-40 bg-zinc-50" />
				{table[0].map((_, i) =>
					i % 5 === 0 ? (
						<div
							key={i}
							className="relative z-10 overflow-visible bg-zinc-50"
							style={{width: cellSize, height: cellSize}}
						>
							<span className="absolute left-1/2 w-max -translate-x-1/2">{i}</span>
						</div>
					) : (
						<div key={i} className="w-4 bg-zinc-50" />
					),
				)}
			</div>
			<div className="sticky left-0 z-10 inline-block h-full w-40 bg-zinc-50 text-right">
				{table.map((episodes, i) => (
					<p key={shows[i].id} className="overflow-hidden text-ellipsis whitespace-nowrap px-2 text-xs">
						{shows[i].name}
					</p>
				))}
			</div>

			<EpisodeTableOverlay tableScroll={[x, y]} />
			{isBrowser && (
				<div className="absolute left-40 top-4 w-max">
					{table.slice(yMin, yMax).map((row, i) =>
						row.slice(xMin, xMax).map((cell, j) =>
							cell === null ? null : (
								<div
									key={`${i}-${j}`}
									className="absolute rounded-sm border border-zinc-950"
									style={{
										top: (yMin + i) * cellSize,
										left: (xMin + j) * cellSize,
										width: cellSize,
										height: cellSize,
										backgroundColor: cell,
									}}
								/>
							),
						),
					)}
				</div>
			)}
		</>
	)
}
