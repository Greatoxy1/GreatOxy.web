import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Search from "./components/Search.jsx";
import MovieCard from "./components/MovieCard.jsx";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = "https://api.themoviedb.org/3/";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) throw new Error(`Failed to fetch movies`);

      const data = await response.json();
      setMovieList(data.results || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrailerClick = async (movieId) => {
    try {
      const res = await fetch(`${API_BASE_URL}movie/${movieId}/videos`, API_OPTIONS);
      const data = await res.json();
      console.log("Video API results:", data.results);

      const trailers = data.results.filter(video => video.site === "YouTube");

      const preferredTrailer =
        trailers.find(video => video.type === "Trailer" && video.iso_639_1 === "en") ||
        trailers.find(video => video.type === "Trailer") ||
        trailers.find(video => video.type === "Teaser") ||
        trailers.find(video => video.type === "Clip") ||
        trailers[0];

      if (preferredTrailer) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${preferredTrailer.key}`);
        setIsModalOpen(true);
      } else {
        alert("No playable video found for this movie.");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen("");
    setTrailerUrl("");
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="images.jpeg" alt="images" />
          <h1>
            Find <span>Movies</span>
          </h1>
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={() => fetchMovies(searchTerm)}
          />
        </header>

        <section className="movie-list">
          <h2>All Movies</h2>

          {isLoading && <p>Loading...</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}

          {movieList.length > 0 ? (
            <ul>
              {movieList.map((movie) => (
                <li key={movie.id}>
                  <MovieCard
                    movie={movie}
                    onPlayTrailer={() => handleTrailerClick(movie.id)}
                    fallbackImage="no-trailer.png" 
                  />
                </li>
              ))}
            </ul>
          ) : (
            !isLoading && <p>No movies found.</p>
          )}
        </section>
      </div>

      {isModalOpen && (
        <div className="modal-overlay show" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              ✖
            </button>
            <ReactPlayer
              url={trailerUrl}
              className="react-player"
              width="100%"
              height="400px"
              controls
              playing
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
