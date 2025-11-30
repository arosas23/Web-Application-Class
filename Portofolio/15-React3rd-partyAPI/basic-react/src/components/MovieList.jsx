import MovieCard from "./MovieCard";
import movies from "../data";

export default function MovieList() {
  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center fw-bold">Star Wars Movies</h1>

      <div className="row g-4">
        {movies.map((m) => (
          <div className="col-md-4 col-lg-3" key={m.episode}>
            <MovieCard movie={m} />
          </div>
        ))}
      </div>
    </div>
  );
}
