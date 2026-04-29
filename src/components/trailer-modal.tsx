import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useMovies } from '../context/movieContext';

type Props = {
  movieId: number;
  onClose: () => void;
};

type VideoResult = { key: string; site: string; type: string; official?: boolean };
type Genre = { id: number; name: string };
type CastMember = { name: string };
type MovieDetails = {
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  number_of_seasons?: number;
  runtime?: number;
  genres: Genre[];
  tagline?: string;
};

const API_KEY = '3b15408b1762f4fba848dc43cd57a0b1';
const IMG = 'https://image.tmdb.org/t/p/original';

export default function TrailerModal({ movieId, onClose }: Props) {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const { addToList, removeFromList, myList } = useMovies();
  const isAdded = myList.some((m) => m.id === movieId);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const tryFetch = async (kind: 'movie' | 'tv') => {
          const [d, v, c] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/${kind}/${movieId}?api_key=${API_KEY}&language=en-US`).then(r => r.ok ? r.json() : null),
            fetch(`https://api.themoviedb.org/3/${kind}/${movieId}/videos?api_key=${API_KEY}`).then(r => r.ok ? r.json() : null),
            fetch(`https://api.themoviedb.org/3/${kind}/${movieId}/credits?api_key=${API_KEY}`).then(r => r.ok ? r.json() : null),
          ]);
          return { d, v, c };
        };

        let { d, v, c } = await tryFetch('movie');
        if (!d || d.success === false) ({ d, v, c } = await tryFetch('tv'));
        if (cancelled || !d) return;

        const trailers = (v?.results ?? []) as VideoResult[];
        const trailer =
          trailers.find(t => t.site === 'YouTube' && t.type === 'Trailer' && t.official) ||
          trailers.find(t => t.site === 'YouTube' && t.type === 'Trailer') ||
          trailers.find(t => t.site === 'YouTube');

        setVideoKey(trailer?.key || null);
        setDetails(d);
        setCast((c?.cast ?? []).slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    document.body.style.overflow = 'hidden';
    return () => {
      cancelled = true;
      document.body.style.overflow = '';
    };
  }, [movieId]);

  const title = details?.title || details?.name || '';
  const year = (details?.release_date || details?.first_air_date || '').slice(0, 4);
  const seasons = details?.number_of_seasons;
  const runtime = details?.runtime;
  const description = details?.overview?.trim() || details?.tagline?.trim() || 'No description available for this title.';

  const handleToggleList = () => {
    if (isAdded) {
      removeFromList(movieId);
    } else {
      addToList({
        id: movieId,
        title: title,
        poster_path: details?.poster_path || '',
        backdrop_path: details?.backdrop_path || '',
      });
    }
  };

  const modal = (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex justify-center items-start sm:items-center py-8 px-2"
      onClick={onClose}
    >
      <div
        className="relative w-[95%] max-w-4xl bg-[#181818] rounded-md overflow-y-auto overflow-x-hidden text-white shadow-2xl max-h-[90vh] my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero / Trailer */}
        <div className="relative w-full aspect-video bg-black">
          {videoKey ? (
            <iframe
              key={videoKey + (muted ? '1' : '0')}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&modestbranding=1&rel=0&playsinline=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : details?.backdrop_path ? (
            <img src={IMG + details.backdrop_path} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500">
              {loading ? 'Loading…' : 'Trailer not available'}
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#181818] to-transparent" />

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#181818] hover:bg-black flex items-center justify-center text-white text-lg z-10"
          >
            ✕
          </button>

          <div className="absolute left-0 right-0 bottom-4 px-6 sm:px-10 flex flex-col gap-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold drop-shadow-lg">{title}</h1>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-white text-black font-semibold px-5 py-2 rounded hover:bg-white/90">
                <span className="text-lg">▶</span> Play
              </button>
              <button
                onClick={handleToggleList}
                aria-label={isAdded ? 'Remove from list' : 'Add to list'}
                className="w-10 h-10 rounded-full border-2 border-white/60 hover:border-white flex items-center justify-center text-xl bg-black/40"
              >
                {isAdded ? '✔' : '+'}
              </button>
              <button
                aria-label="Like"
                className="w-10 h-10 rounded-full border-2 border-white/60 hover:border-white flex items-center justify-center bg-black/40"
              >
                👍
              </button>
              <div className="ml-auto">
                {videoKey && (
                  <button
                    onClick={() => setMuted(m => !m)}
                    aria-label="Toggle sound"
                    className="w-10 h-10 rounded-full border-2 border-white/60 hover:border-white flex items-center justify-center bg-black/40"
                  >
                    {muted ? '🔇' : '🔊'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {year && <span className="text-green-400 font-semibold">{year}</span>}
              {seasons && <span className="text-zinc-300">{seasons} {seasons === 1 ? 'Season' : 'Seasons'}</span>}
              {runtime ? <span className="text-zinc-300">{Math.floor(runtime / 60)}h {runtime % 60}m</span> : null}
              <span className="border border-zinc-500 text-zinc-200 text-[10px] px-1 leading-4">HD</span>
              <span className="border border-zinc-500 text-zinc-200 text-[10px] px-1 leading-4">AD</span>
              <span className="border border-zinc-500 text-zinc-200 text-[10px] px-1 leading-4">CC</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
              <span className="border border-zinc-400 px-1 text-xs font-bold">A</span>
              <span>violence, language, substances</span>
            </div>

            {/* Description / Overview */}
            <div className="space-y-2">
              {details?.tagline && (
                <p className="text-base font-semibold italic text-zinc-200">"{details.tagline}"</p>
              )}
              <h3 className="text-lg font-bold text-white">About {title}</h3>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-100 whitespace-pre-line">
                {loading ? 'Loading description…' : description}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            {cast.length > 0 && (
              <div>
                <span className="text-zinc-500">Cast: </span>
                <span className="text-zinc-200">
                  {cast.slice(0, 3).map(c => c.name).join(', ')}
                  {cast.length > 3 && <span className="text-zinc-400">, more</span>}
                </span>
              </div>
            )}
            {details?.genres && details.genres.length > 0 && (
              <div>
                <span className="text-zinc-500">Genres: </span>
                <span className="text-zinc-200">{details.genres.map(g => g.name).join(', ')}</span>
              </div>
            )}
            <div>
              <span className="text-zinc-500">This Show Is: </span>
              <span className="text-zinc-200">Exciting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.getElementById('modal-root')!);
}
