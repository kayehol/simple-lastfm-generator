import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import { fetchArtists } from '../queries/fetchArtists';
import { fetchTags } from '../queries/fetchTags';
import { Artist, ArtistQuery } from '../types/Artist';
import { TagsQuery } from '../types/Tag';
import './../App.css';

const Styled = styled.div`
    border: 4px solid var(--color-foreground);
    margin: 1em;
    padding: 1em;
    form {
        margin-bottom: 1em;
    }
    input {
        border: 2px solid black;
        padding: 0.5em 0 0.5em 0.5em;
    }
    button {
        margin-left: 1em;
        background-color: var(--color-foreground);
        color: var(--color-background);
        border: 0;
        padding: 0.5em;
    }
    .output {
        font-size: 150%;
        padding: 1em;
        border: 1px solid grey;
        height: 20vh;
        width: 40vw;
        word-wrap; break-word;
    }
    .upperForm {
        display: flex;
        flex-direction: row;
    }
    .config {
        margin-left: 1em;
    }
    @media screen and (max-width: 900px) {
        .output {
            width: auto;
            height: auto;
        }
        .upperForm {
            flex-direction: column;
        }
    }
`

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
        <Styled>
            <div className='upperForm'>
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
                <div className='config'>
                    {username && <pre>Output for {username}'s last 7 days:</pre>}
                </div>
            </div>
            <div className='output'>
                {topArtists && <p>{formatArtist(topArtists)}</p>}
                {tags && <p>{formatTags(tags)}</p>}
                {isError && error instanceof Error && <>{error.message}</>}
                {isLoading && <pre>Loading...</pre>}
            </div>
        </Styled>
    )
}
