import { useState } from "react";
import movies from "./data";
import MovieCard from "./components/MovieCard";
import MovieDetail from "./components/MovieDetail";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="container py-4">

      <h1 className="text-center mb-4 fw-bold">Movie Gallery</h1>

      {/* GRID Bootstrap */}
      <div className="row g-4">
        {movies.map((movie, index) => (
          <div className="col-md-4 col-lg-3" key={index}>
            <MovieCard movie={movie} onSelect={() => setSelectedMovie(movie)} />
          </div>
        ))}
      </div>

      {/* Detalle */}
      {selectedMovie && (
        <div className="mt-5">
          <MovieDetail movie={selectedMovie} />
        </div>
      )}

    </div>
  );
}
