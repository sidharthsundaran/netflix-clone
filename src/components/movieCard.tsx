import type { Movie } from './movieRow'

type Props = {
  movie: Movie
  onPlay: () => void
}

export default function MovieCard({ movie, onPlay }: Props) {
  const imageBase = 'https://image.tmdb.org/t/p/w500'

  return (
    <img
      src={imageBase + movie.poster_path}
      alt={movie.title || movie.name}
      className="w-36 sm:w-48 max-h-64 object-cover rounded transition-transform hover:scale-105 cursor-pointer"
      onClick={onPlay} 
    />
  )
}