import { useQuery } from 'react-query';
import { Header } from './components/Header';
import './App.css';

const getMock = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const getArtists = async () => {
  const params = {
    method: 'user.gettopartists',
    user: import.meta.env.VITE_LASTFM_USER,
    period: '7day',
    limit: 5,
    api_key: import.meta.env.VITE_LASTFM_API_KEY,
    format: 'json'
  }
  const response = await fetch(
    import.meta.env.VITE_LASTFM_API_ROOT + `?method=${params.method}&user=${params.user}&api_key=${params.api_key}&period=${params.period}&limit=${params.limit}&format=${params.format}`
  )
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}

function App() {
  // const { isLoading, isError, data, error } = useQuery('mock', getMock);
  const { isLoading, isError, data, error } = useQuery('artists', getArtists);

  if (isLoading) return <span>Loading...</span>
  if (isError) return <span>Error: {error.message}</span>

  return (
    <div className="App">
      <Header />
      <pre>{data.topartists.artist.map(artist => <>{artist.name + '\n'}</>)}</pre>
    </div>
  )
}

export default App
