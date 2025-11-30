import axios from "axios";

// The server in `server/.env` uses PORT=4000 — point the client to that port.
const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Movies
export const getMovies = () => API.get("/movies");
export const getMovie = (episode) => API.get(`/movies/${episode}`);

// Comments
export const getComments = (episode) =>
  API.get(`/movies/${episode}/comments`);

export const postComment = (episode, comment) =>
  API.post(`/movies/${episode}/comments`, comment);

// Likes/Dislikes
export const updateLikes = (episode, likes) =>
  API.put(`/movies/${episode}/likes`, { likes });

export const updateDislikes = (episode, dislikes) =>
  API.put(`/movies/${episode}/dislikes`, { dislikes });
