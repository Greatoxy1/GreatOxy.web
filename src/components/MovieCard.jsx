const MovieCard = ({ movie, onPlayTrailer }) => {
  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <h3>{movie.title}</h3>
      <button onClick={onPlayTrailer}>Play Trailer</button>
    </div>
  );
};

export default MovieCard;
