import { Artist } from "./Artist"

export type ArtistQuery = {
    topartists: {
        artist: Artist[],
        '@attr': {}
    }
}
