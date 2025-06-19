import { useEffect, useState } from 'react';
import axios from 'axios';

type Props = {
  fetchUrl: string;
};

type Movie = {
  title?: string;
  name?: string;
  original_name?: string;
  backdrop_path: string;
  overview: string;
};

const base_url = "https://image.tmdb.org/t/p/original/";

export default function Banner({ fetchUrl }: Props) {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(fetchUrl);
      const randomMovie = res.data.results[Math.floor(Math.random() * res.data.results.length)];
      setMovie(randomMovie);
    }
    fetchData();
  }, [fetchUrl]);

  return (
    <header
      className="relative h-[75vh] bg-cover bg-center"
      style={{
        backgroundImage: `url(${base_url}${movie?.backdrop_path})`,
      }}
    >
      <div className="bg-gradient-to-b from-black/10 via-black/40 to-black absolute inset-0" />
      <div className="relative z-10 px-6 sm:px-12 pt-40 space-y-5 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <p className="text-sm sm:text-base max-h-24 overflow-hidden text-gray-300">
          {movie?.overview}
        </p>
        <div className="flex gap-4">
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition">Play</button>
          <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition">More Info</button>
        </div>
      </div>
    </header>
  );
}
