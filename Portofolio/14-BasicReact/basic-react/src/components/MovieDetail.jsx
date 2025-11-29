import { useState } from "react";

export default function MovieDetail({ movie }) {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", text: "" });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.text) return;

    setComments([...comments, form]);
    setForm({ name: "", text: "" });
  }

  {/*Function to assign color according to character type*/}
  const getRoleColor = (role) => {
    if (!role) return "#6c757d"; 
    switch (role.toLowerCase()) {
      case "jedi":
        return "#28a745"; 
      case "sith":
        return "#dc3545"; 
      case "rebel":
        return "#f0ad4e";
      case "bounty hunter":
        return "#6f42c1"; 
      default:
        return "#6c757d";
    }
  };


  return (
    <div className="card p-4 shadow-lg">

      <div className="row g-4 align-items-center">

        {/*Image*/}
        <div className="col-md-4">
          <img
            src={movie.character.image}
            alt={movie.character.name}
            className="img-fluid rounded"
          />
        </div>

        {/*Info*/}
        <div className="col-md-8">

          <h2 className="mb-1">{movie.character.name}</h2>

          {/*Role*/}
          {movie.character.role && (
            <span
              className="px-3 py-1 rounded fw-semibold text-white d-inline-block mb-3"
              style={{
                backgroundColor: getRoleColor(movie.character.role),
              }}
            >
              {movie.character.role}
            </span>
          )}

          <p className="text-muted">{movie.character.bio}</p>
        </div>
      </div>

      <hr className="my-4" />

      {/*Form*/}
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

      {/*Comments list*/}
      <div className="mt-4">
        <h5>Comments</h5>

        {comments.length === 0 && <p className="text-muted">No comments yet.</p>}

        {comments.map((c, i) => (
          <div key={i} className="border rounded p-2 mb-2 bg-light">
            <strong>{c.name}</strong>
            <p className="mb-0">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
