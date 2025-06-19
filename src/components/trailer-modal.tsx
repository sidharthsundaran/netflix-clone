import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type Props = {
  movieId: number;
  onClose: () => void;
};

type VideoResult = {
  key: string;
  site: string;
  type: string;
};

export default function TrailerModal({ movieId, onClose }: Props) {
  const [videoKey, setVideoKey] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrailer() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=3b15408b1762f4fba848dc43cd57a0b1`
        );
        const data = await res.json();
        const trailers = data.results as VideoResult[];
        const trailer = trailers.find(
          (v) => v.site === 'YouTube' && v.type === 'Trailer'
        );
        setVideoKey(trailer?.key || null);
      } catch (err) {
        console.error('Failed to load trailer:', err);
      }
    }

    fetchTrailer();
  }, [movieId]);

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
      <div className="bg-zinc-900 p-4 rounded-md w-[90%] max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-white text-xl"
          onClick={onClose}
        >
          ✖
        </button>
        {videoKey ? (
          <iframe
            className="w-full aspect-video rounded"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <p className="text-white">Trailer not available.</p>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById('modal-root')!);
}
