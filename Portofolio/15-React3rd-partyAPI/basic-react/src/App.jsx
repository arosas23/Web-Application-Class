import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import MovieDetailPage from "./components/MovieDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/movie/:episode" element={<MovieDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
