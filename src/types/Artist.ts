export type ArtistQuery = {
    topartists: {
        artist: Artist[],
        '@attr': {}
    }
}

export type Artist = {
    streamable: string;
    image: [];
    mbid: string;
    url: string;
    playcount: string;
    '@attr': { rank: string; };
    name: string;
}
