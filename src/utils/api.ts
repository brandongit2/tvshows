import {TMDB_TOKEN} from "@/app/env"

export async function tmdbApi<T>(endpoint: string): Promise<T> {
	while (true) {
		try {
			const res = await fetch(`https://api.themoviedb.org/3/${endpoint}`, {
				headers: {
					Authorization: `Bearer ${TMDB_TOKEN}`,
				},
			})
			if (res.status === 429) {
				await new Promise((resolve) => setTimeout(resolve, 1000))
				continue
			}
			const data = (await res.json()) as T
			return data
		} catch (err) {
			console.log(err)
			console.log(`hahahaha`)
		}
	}
}
