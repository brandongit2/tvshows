import invariant from "tiny-invariant"

invariant(process.env.TMDB_TOKEN, `TMDB_TOKEN is not defined`)
export const TMDB_TOKEN = process.env.TMDB_TOKEN
