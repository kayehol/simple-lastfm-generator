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
    const { data: tags } = useQuery(['tags', topArtists], fetchTags, {
        enabled: !!topArtists 
    });
            
    const formatArtist = (artists: ArtistQuery): string => {
        const artistsList = artists?.topartists.artist;
        
        if (artistsList && artistsList.length == 0) return "user hasn't listened to any music in the selected date range."
        
        const artistNameRank: string[] = artists?.topartists.artist.map((artist: Artist, index: number) => {
            return `${artist['@attr'].rank}. ${artist.name}`;
        });

        return artistNameRank.join(' | ');
    }
    const formatTags = (tags: TagsQuery): string => {
        const tagsList: string[] = tags.map((tag) => tag?.toptags?.tag[0]?.name);
        return tagsList.length > 0 ? `tags: ${tagsList.join(', ')}` : '';
    }

    return (
        <>
            <form onSubmit={event => event.preventDefault()}>
                <input
                    autoFocus 
                    type="text" 
                    onChange={event => setUsername(event.currentTarget?.value)}
                    placeholder="username" 
                />
                <button type="submit" onClick={() => refetch()}>
                    generate
                </button>
            </form>
            {username && <pre>Output for {username}'s last 7 days:</pre>}
            {topArtists && <pre>{formatArtist(topArtists)}</pre>}
            {tags && <pre>{formatTags(tags)}</pre>}
            {isError && <>{error.message}</>}
            {isLoading && <pre>Loading...</pre>}
        </>
    )
}