import { useState } from 'react';
import { useQuery } from 'react-query';

import { fetchArtists } from './fetchArtists';
import { fetchTags } from './fetchTags';
import { Artist, ArtistQuery } from './types/Artist';
import { TagsQuery } from './types/Tag';

export const Chart = () => {
    const [ username, setUsername ] = useState('');

    // get top artists
    const { isLoading, isError, data: topArtists, error, refetch } = useQuery(['artists', username], fetchArtists, { 
        enabled: false 
    });
    // get top tags for every artist
    const { isIdle, data: tags } = useQuery(['tags', topArtists], fetchTags, {
        enabled: !!topArtists 
    });
            
    const formatArtist = (artists: ArtistQuery): string => {
        const artistsList: string[] = artists?.topartists.artist.map((artist: Artist, index: number) => {
            return `${artist['@attr'].rank}. ${artist.name}`;
        });
        return artistsList ? artistsList.join(' | ') : '';
    }
    const formatTags = (tags: TagsQuery | undefined): string => {
        const tagsList: string[] = tags ? tags.map((tag) => tag?.toptags?.tag[0]?.name) : [''];
        return `tags: ${tagsList.join(', ')}`
    }

    return (
        <>
            <div>
                <input 
                    type="text" 
                    onChange={event => setUsername(event.currentTarget?.value)} />
                <button onClick={() => refetch()}>
                    generate
                </button>
            </div>
            {username && <pre>Output for {username}:</pre>}
            {<pre>{formatArtist(topArtists)}</pre>}
            {<pre>{formatTags(tags)}</pre>}
            {isError && <>{error.message}</>}
            {isLoading && <pre>Loading...</pre>}
        </>
    )
}