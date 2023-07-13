export type TmdbConfigurationDetails = {
	images: {
		base_url: string
		secure_base_url: string
		backdrop_sizes: Array<string>
		logo_sizes: Array<string>
		poster_sizes: Array<string>
		profile_sizes: Array<string>
		still_sizes: Array<string>
	}
	change_keys: Array<string>
}

export type TmdbSearchTv = {
	page: number
	results: Array<{
		adult: boolean
		backdrop_path: string
		genre_ids: Array<number>
		id: number
		origin_country: Array<string>
		original_language: string
		original_name: string
		overview: string
		popularity: number
		poster_path: string
		first_air_date: string
		name: string
		vote_average: number
		vote_count: number
	}>
	total_pages: number
	total_results: number
}

export type TmdbTvSeriesDetails = {
	adult: boolean
	backdrop_path: string
	created_by: Array<{
		id: number
		credit_id: string
		name: string
		gender: number
		profile_path: string
	}>
	episode_run_time: Array<number>
	first_air_date: string
	genres: Array<{
		id: number
		name: string
	}>
	homepage: string
	id: number
	in_production: boolean
	languages: Array<string>
	last_air_date: string
	last_episode_to_air: {
		id: number
		name: string
		overview: string
		vote_average: number
		vote_count: number
		air_date: string
		episode_number: number
		production_code: string
		runtime: number
		season_number: number
		show_id: number
		still_path: string
	}
	name: string
	next_episode_to_air: string
	networks: Array<{
		id: number
		logo_path: string
		name: string
		origin_country: string
	}>
	number_of_episodes: number
	number_of_seasons: number
	origin_country: Array<string>
	original_language: string
	original_name: string
	overview: string
	popularity: number
	poster_path: string
	production_companies: Array<{
		id: number
		logo_path: string
		name: string
		origin_country: string
	}>
	production_countries: Array<{
		iso_3166_1: string
		name: string
	}>
	seasons: Array<{
		air_date: string
		episode_count: number
		id: number
		name: string
		overview: string
		poster_path: string
		season_number: number
	}>
	spoken_languages: Array<{
		english_name: string
		iso_639_1: string
		name: string
	}>
	status: string
	tagline: string
	type: string
	vote_average: number
	vote_count: number
}
