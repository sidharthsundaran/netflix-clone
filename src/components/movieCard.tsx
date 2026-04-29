import type { Movie } from './movieRow'

type Props = {
  movie: Movie
  onPlay: () => void
}

export default function MovieCard({ movie, onPlay }: Props) {
  const imageBase = 'https://image.tmdb.org/t/p/w500'

  const image =
    movie.poster_path
      ? imageBase + movie.poster_path
      : movie.backdrop_path
      ? imageBase + movie.backdrop_path
      : '/no-image.png'

  return (
    <img
      src={image}
      alt={movie.title || movie.name}
      className="w-36 sm:w-48 max-h-64 object-cover rounded transition-transform hover:scale-105 cursor-pointer"
      onClick={onPlay}
    />
  )
}