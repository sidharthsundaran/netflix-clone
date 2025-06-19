import { useEffect, useState } from 'react'
import axios from 'axios'
import '../App.css'
import MovieCard from './movieCard'

type Props = {
    title: string
    fetchUrl: string
    isLargeRow?: boolean
}

export type Movie = {
    id: number
    name?: string
    title?: string
    poster_path: string
    backdrop_path: string
}


const base_url = 'https://image.tmdb.org/t/p/original';


export default function MovieRow({ title, fetchUrl, isLargeRow = false }: Props) {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(fetchUrl)
            setMovies(response.data.results)
        }
        fetchData()
    }, [fetchUrl])

    return (
        <div className='text-white px-4 mb-6'>
            <h2 className='text-xl font-bold mb-2'>{title}</h2>
            <div className="flex overflow-x-auto space-x-2 scrollbar-hide p-2 -ml-2">
                {movies.map((movie) => (
                    <img
                        key={movie.id}
                        src={`${base_url}${movie.poster_path}`}
                        alt={movie.name || movie.title}
                        className="w-36 sm:w-48 max-h-64 object-cover rounded transition-transform hover:scale-105"
                    />
                ))}
            </div>
        </div>
    )
}