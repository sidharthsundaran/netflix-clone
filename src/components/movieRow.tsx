import { useEffect, useState } from 'react'
import axios from 'axios'
import '../App.css'
import MovieCard from './movieCard'
import TrailerModal from './trailer-modal'

type Props = {
    title: string
    fetchUrl?: string
    isLargeRow?: boolean
    movies?: Movie[]        // 🔥 custom movies (My List)
    isCustomRow?: boolean   // 🔥 flag
}

export type Movie = {
    id: number
    name?: string
    title?: string
    poster_path: string
    backdrop_path: string
}

const base_url = 'https://image.tmdb.org/t/p/original';

export default function MovieRow({
    title,
    fetchUrl,
    isLargeRow = false,
    movies: customMovies,
    isCustomRow = false
}: Props) {

    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)

    useEffect(() => {
        // 🔥 If it's My List (custom row)
        if (isCustomRow && customMovies) {
            setMovies(customMovies);
            return;
        }

        // 🔥 Otherwise fetch from API
        const fetchData = async () => {
            const response = await axios.get(fetchUrl!);
            setMovies(response.data.results);
        };

        fetchData();
    }, [fetchUrl, customMovies, isCustomRow]);

    return (
        <div className='text-white px-4 mb-6'>
            <h2 className='text-xl font-bold mb-2'>{title}</h2>

            <div className="flex overflow-x-auto space-x-2 scrollbar-hide p-2 -ml-2">
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        onPlay={() => setSelectedMovieId(movie.id)}
                    />
                ))}
            </div>

            {selectedMovieId && (
                <TrailerModal
                    movieId={selectedMovieId}
                    onClose={() => setSelectedMovieId(null)}
                />
            )}
        </div>
    )
}