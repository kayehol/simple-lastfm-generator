import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import { fetchArtists } from '../queries/fetchArtists';
import { fetchTags } from '../queries/fetchTags';
import { Artist, ArtistQuery } from '../types/Artist';
import { Period } from '../types/Period';
import { TagsQuery } from '../types/Tag';
import { periods } from './configs/periods';
import './../App.css';

const Styled = styled.div`
    form {
        display: flex;
        flex-direction: row;
    }
    button, select, input {
        background-color: var(--color-background);
        color: var(--color-foreground);
    }
    button, select {
        width: 25%;
        margin-left: 0.5em;
        cursor: pointer;
    }
    button:hover {
        border: 2px solid red;
    }
    button p {
        font-size: 200%;
    }
    input {
        width: 90%;
        font-size: 400%;
    }
    select {
        font-size: 150%;
        text-align: center;
    }
    .output {
        height: 100vh;
        font-size: 300%;
        text-wrap: wrap;
        text-align: left;
        padding: 0.25em;
    }
    .upperForm {
        display: flex;
        flex-direction: column;
    }
    #tags {
        font-size: 75%;
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
    const [ period, setPeriod ] = useState('7day');
    const currentPeriodDescription = periods.filter(item => item.id == period).map(item => item.description)
    
    const { isLoading, isError, data: topArtists, error, refetch } = useQuery(['artists', username, period], fetchArtists, { 
        enabled: false 
    });
    const { data: tags } = useQuery(['tags', topArtists], fetchTags, {
        enabled: !!topArtists 
    });
            
    const formatArtist = (artists: ArtistQuery): string => {
        const artistsList = artists?.topartists.artist;
        
        if (artistsList && artistsList.length == 0) return "user hasn't listened to any music in the selected date range."
        
        const artistNameRank: string[] = artists?.topartists.artist.map((artist: Artist, index: number) => {
            return `${artist['@attr'].rank}. ${artist.name}`;
        });

        return artistNameRank.join('\n');
    }
    const formatTags = (tags: TagsQuery): string => {
        const tagsList: string[] = tags.map((tag) => tag?.toptags?.tag[0]?.name);
        return tagsList.length > 0 ? `${tagsList.join(', ')}` : '';
    }

    const onPeriodChange = (e: any) => {
        setPeriod(e.target.value);
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
                    <select
                        onChange={onPeriodChange}
                    >
                        {periods.map((item: Period) => 
                            <option
                                id={item.id}
                                value={item.id}
                            >
                                {item.description.toUpperCase()}
                            </option>
                        )}
                    </select>
                    <button type="submit" onClick={() => refetch()}>
                        <p>GENERATE</p>
                    </button>
                </form>
                <div className='config'>
                    <pre>
                        Output for {username ? username : 'your'} {period == 'overall' ? 'activity' : 'last'} {currentPeriodDescription}:
                    </pre>
                </div>
            </div>
            <div className='output'>
                {topArtists && <p>{formatArtist(topArtists)}</p>}
                <div id="tags">
                    {tags && <p>{formatTags(tags)}</p>}
                </div>
                {isError && error instanceof Error && <>{error.message}</>}
                {isLoading && <pre>Loading...</pre>}
            </div>
        </Styled>
    )
}
