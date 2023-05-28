import { QueryFunctionContext } from '@tanstack/react-query';
import { ArtistQuery } from '../types/Artist';
import { Params } from '../types/Params';

export const fetchArtists = async ({ queryKey }: QueryFunctionContext<string[]>): Promise<ArtistQuery> => {
    const apiKey: string = import.meta.env.VITE_LASTFM_API_KEY; 
    const apiRoot: string = import.meta.env.VITE_LASTFM_API_ROOT;
    const [_key, username] = queryKey;
    
    const params: Params = {
      method: 'user.gettopartists',
      user: username,
      period: '7day',
      limit: 5,
      api_key: apiKey,
      format: 'json'
    }

    if (!apiKey || !apiRoot) 
        throw new Error('Error: Environment variables are not accessible')

    const response = await fetch(
      apiRoot + `?method=${params.method}&user=${params.user}&api_key=${params.api_key}&period=${params.period}&limit=${params.limit}&format=${params.format}`
    )
    if (!response.ok) throw new Error('Error: Network response was not ok')

    return response.json()
}
  
