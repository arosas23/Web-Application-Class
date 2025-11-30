import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovie, updateLikes, updateDislikes } from "../api";
import {
  HandThumbsUp,
  HandThumbsUpFill,
  HandThumbsDown,
  HandThumbsDownFill
} from "react-bootstrap-icons";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const [hover, setHover] = useState(false);

  const borderColor =
    movie.character.affiliation === "good" ? "blue" : "red";

  // Fetch likes/dislikes on mount
  useEffect(() => {
    getMovie(movie.episode)
      .then((res) => {
        setLikes(res.data.likes || 0);
        setDislikes(res.data.dislikes || 0);
      })
      .catch(() => {
        setLikes(0);
        setDislikes(0);
      });
  }, [movie.episode]);

  const handleMore = () => {
    navigate(`/movie/${movie.episode}`);
  };

  const handleLike = async () => {
    const newLiked = !liked;
    const newLikes = likes + (newLiked ? 1 : -1);

    setLiked(newLiked);
    setLikes(newLikes);

    // Remove dislike if it was set
    if (disliked) {
      setDisliked(false);
      setDislikes(dislikes - 1);
      try {
        await updateDislikes(movie.episode, dislikes - 1);
      } catch (err) {
        console.error("Failed to update dislikes:", err);
      }
    }

    // Save likes to backend
    try {
      await updateLikes(movie.episode, newLikes);
    } catch (err) {
      console.error("Failed to update likes:", err);
    }
  };

  const handleDislike = async () => {
    const newDisliked = !disliked;
    const newDislikes = dislikes + (newDisliked ? 1 : -1);

    setDisliked(newDisliked);
    setDislikes(newDislikes);

    // Remove like if it was set
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
      try {
        await updateLikes(movie.episode, likes - 1);
      } catch (err) {
        console.error("Failed to update likes:", err);
      }
    }

    // Save dislikes to backend
    try {
      await updateDislikes(movie.episode, newDislikes);
    } catch (err) {
      console.error("Failed to update dislikes:", err);
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
      {/* Poster area*/}
      <div
        onClick={handleMore}
        style={{ cursor: "pointer" }}
      >
        <img
          src={hover ? movie.character.logo : movie.poster}
          className="card-img-top"
          alt={movie.title}
          style={{ height: "320px", objectFit: "cover" }}
        />
      </div>

      <div className="card-body text-center">
        {/* Title area*/}
        <div onClick={handleMore} style={{ cursor: "pointer" }}>
          <h5 className="card-title fw-bold">{movie.title}</h5>
          <p className="text-muted">{movie.year}</p>
        </div>

        {/* Like & Dislike */}
        <div className="d-flex justify-content-center gap-4 align-items-center mb-3">
          <div className="text-center">
            <button
              className="btn btn-link p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              style={{ fontSize: "2rem" }}
            >
              {liked ? <HandThumbsUpFill className="text-primary" /> : <HandThumbsUp className="text-secondary" />}
            </button>
            <div className="fw-semibold">{likes}</div>
          </div>

          <div className="text-center">
            <button
              className="btn btn-link p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleDislike();
              }}
              style={{ fontSize: "2rem" }}
            >
              {disliked ? <HandThumbsDownFill className="text-danger" /> : <HandThumbsDown className="text-secondary" />}
            </button>
            <div className="fw-semibold">{dislikes}</div>
          </div>
        </div>

        <button className="btn btn-dark w-100" onClick={handleMore}>
          More...
        </button>
      </div>
    </div>
  );
}
