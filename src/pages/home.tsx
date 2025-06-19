import MovieRow from '../components/movieRow';
import requests from '../lib/tmdb';
import Navbar from '../components/navbar';
import Banner from '../components/banner';

export default function HomePage() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar/>
      <Banner fetchUrl={requests.fetchNetflixOriginals}/>
      <MovieRow title="Trending Now" fetchUrl={requests.fetchTrending} />
      <MovieRow title="Top Rated" fetchUrl={requests.fetchTopRated} />
      <MovieRow title="Action Movies" fetchUrl={requests.fetchActionMovies} />
      <MovieRow title="Comedies" fetchUrl={requests.fetchComedyMovies} />
      <MovieRow title="Romance" fetchUrl={requests.fetchRomanceMovies} />
      <MovieRow title="Horror" fetchUrl={requests.fetchHorrorMovies} />
      <MovieRow title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
    </div>
  );
}
