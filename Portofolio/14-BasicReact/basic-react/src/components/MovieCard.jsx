import { useState } from "react";
import {
  HandThumbsUp,
  HandThumbsUpFill,
  HandThumbsDown,
  HandThumbsDownFill
} from "react-bootstrap-icons";

export default function MovieCard({ movie, onSelect }) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const [hover, setHover] = useState(false);

  const borderColor =
    movie.character.affiliation === "good" ? "#0d6efd" : "#dc3545";

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
      return;
    }

    setLiked(true);
    setLikes(likes + 1);

    {/*If it was marked "dislike", we removed it*/}
    if (disliked) {
      setDisliked(false);
      setDislikes(dislikes - 1);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      setDislikes(dislikes - 1);
      return;
    }

    setDisliked(true);
    setDislikes(dislikes + 1);

    {/*If it was marked "like", we removed it*/}
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
    }
  };

  return (
    <div
      className="card shadow-sm"
      style={{
        border: hover ? `3px solid ${borderColor}` : "3px solid transparent",
        transition: "0.3s",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={hover ? movie.character.logo : movie.poster}
        className="card-img-top"
        alt={movie.name}
        style={{ height: "320px", objectFit: "cover" }}
      />

      <div className="card-body text-center">
        <h5 className="card-title fw-bold">{movie.name}</h5>
        <p className="text-muted">{movie.year}</p>

        {/*Like & Dislike*/}
        <div className="d-flex justify-content-center gap-4 align-items-center mb-3">

          {/* Like */}
          <div className="text-center">
            <button
              className="btn btn-link p-0"
              onClick={handleLike}
              style={{ textDecoration: "none", fontSize: "2rem" }}
            >
              {liked ? (
                <HandThumbsUpFill className="text-primary" />
              ) : (
                <HandThumbsUp className="text-secondary" />
              )}
            </button>
            <div className="fw-semibold">{likes}</div>
          </div>

          {/*Dislike*/}
          <div className="text-center">
            <button
              className="btn btn-link p-0"
              onClick={handleDislike}
              style={{ textDecoration: "none", fontSize: "2rem" }}
            >
              {disliked ? (
                <HandThumbsDownFill className="text-danger" />
              ) : (
                <HandThumbsDown className="text-secondary" />
              )}
            </button>
            <div className="fw-semibold">{dislikes}</div>
          </div>
        </div>

        {/*More Button*/}
        <button className="btn btn-dark w-100" onClick={onSelect}>
          More...
        </button>
      </div>
    </div>
  );
}
