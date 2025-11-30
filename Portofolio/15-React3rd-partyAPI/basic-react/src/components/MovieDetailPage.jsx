import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovie, getComments, postComment } from "../api";

export default function MovieDetailPage() {
  const { episode } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", text: "" });

  useEffect(() => {
    let mounted = true;
    getMovie(episode)
      .then((res) => mounted && setMovie(res.data))
      .catch(() => mounted && setMovie(null));

    getComments(episode)
      .then((res) => mounted && setComments(res.data))
      .catch(() => mounted && setComments([]));

    return () => (mounted = false);
  }, [episode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.text) return;

    try {
      const res = await postComment(episode, form);
      setComments((prev) => [...prev, res.data]);
      setForm({ name: "", text: "" });
    } catch (err) {
      console.error("Failed to post comment:", err);
      // fallback: still show locally
      setComments((prev) => [...prev, form]);
      setForm({ name: "", text: "" });
    }
  };

  if (movie === null) return (
    <div className="text-center mt-5">
      <p>Loading...</p>
    </div>
  );

  // Color del rol
  const roleColors = {
    jedi: "#28a745",
    sith: "#dc3545",
    rebel: "#f0ad4e",
    "bounty hunter": "#6f42c1",
  };

  const roleColor = roleColors[movie.character.role?.toLowerCase()] || "#6c757d";

  return (
    <div className="container py-4">
      <Link to="/" className="btn btn-secondary mb-3">Back to Movies</Link>

      <div className="card p-4 shadow-lg">

        <div className="row g-4 align-items-center">
          <div className="col-md-4">
            <img
              src={movie.character.image}
              alt={movie.character.name}
              className="img-fluid rounded"
            />
          </div>

          <div className="col-md-8">
            <h2 className="mb-2">{movie.character.name}</h2>

            {movie.character.role && (
              <div
                style={{
                  backgroundColor: roleColor,
                  padding: "4px 12px",
                  borderRadius: "8px",
                  color: "white",
                  display: "inline-block",
                  marginBottom: "12px",
                  fontWeight: "bold",
                }}
              >
                {movie.character.role}
              </div>
            )}

            <p className="text-muted">{movie.character.bio}</p>
          </div>
        </div>

        <hr className="my-4" />

        <h4>Leave a Comment</h4>

        <form className="mt-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            className="form-control mb-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            placeholder="Your comment"
            className="form-control mb-2"
            rows="3"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          ></textarea>

          <button className="btn btn-primary">Submit</button>
        </form>

        <div className="mt-4">
          <h5>Comments</h5>

          {comments.length === 0 && (
            <p className="text-muted">No comments yet.</p>
          )}

          {comments.map((c, i) => (
            <div key={i} className="border rounded p-2 mb-2 bg-light">
              <strong>{c.name}</strong>
              <p className="mb-0">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
