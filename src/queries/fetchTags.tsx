import { QueryFunctionContext } from '@tanstack/react-query';

import { Params } from "../types/Params";
import { Artist, ArtistQuery } from "../types/Artist";
import { TagsQuery } from "../types/Tag";

export const fetchTags = async ({ queryKey }: QueryFunctionContext<string[] | (string | ArtistQuery | undefined)[]>): Promise<TagsQuery> => {
    const apiKey: string = import.meta.env.VITE_LASTFM_API_KEY;
    const apiRoot: string = import.meta.env.VITE_LASTFM_API_ROOT;
    const formatName = (name: string): string => name.trim()
    const [_key, topArtists] = queryKey;

    if (topArtists instanceof Object) {
        const tagsList = topArtists?.topartists?.artist?.map(async (artist: Artist) => {
            const params: Params = {
                method: 'artist.gettoptags',
                artist: formatName(artist.name),
                api_key: apiKey,
                format: 'json'
            }
            if (!apiKey || !apiRoot)
                throw new Error('Environment variables are not accessible')
            
            const response = await fetch(
                apiRoot + `?method=${params.method}
                            &api_key=${params.api_key}
                            &artist=${params.artist}&format=${params.format}`
            );
            if (!response.ok)
                throw new Error('Network response was not ok');

            return response.json();
        });
        const result = await Promise.all(tagsList);

        return result;
    }
    return [];
}
