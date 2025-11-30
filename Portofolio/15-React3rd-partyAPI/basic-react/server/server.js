// server/server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const data = require("./data"); // we'll create this file with your sw array

const app = express();
app.use(cors());
app.use(express.json());

// Serve static images (put your /images folder inside server/public)
app.use("/images", express.static(path.join(__dirname, "public/images")));

// --- Mongoose models ---
const commentSchema = new mongoose.Schema({
  episode: String,
  name: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});
const Comment = mongoose.model("Comment", commentSchema);

const movieSchema = new mongoose.Schema({
  episode: String,
  title: String,
  year: Number,
  poster: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  character: {
    name: String,
    affiliation: String,
    role: String,
    image: String,
    logo: String,
    bio: String,
  },
});
const Movie = mongoose.model("Movie", movieSchema);

// --- API routes ---

// seed helper: populate movies if empty
async function seedMoviesIfEmpty() {
  const count = await Movie.countDocuments();
  if (count === 0) {
    console.log("Seeding movies into MongoDB...");
    await Movie.insertMany(data.sw);
    console.log("Seeding done.");
  }
}

// GET all movies
app.get("/api/movies", async (req, res) => {
  const movies = await Movie.find({}, "-__v").lean();
  res.json(movies);
});

// GET single movie by episode
app.get("/api/movies/:episode", async (req, res) => {
  const movie = await Movie.findOne({ episode: req.params.episode }, "-__v").lean();
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
});

// GET comments for a movie
app.get("/api/movies/:episode/comments", async (req, res) => {
  const comments = await Comment.find({ episode: req.params.episode }).sort({ createdAt: 1 }).lean();
  res.json(comments);
});

// POST comment for a movie
app.post("/api/movies/:episode/comments", async (req, res) => {
  const { name, text } = req.body;
  if (!name || !text) return res.status(400).json({ message: "Name and text required" });

  const c = new Comment({ episode: req.params.episode, name, text });
  await c.save();
  res.status(201).json(c);
});

// PUT likes/dislikes for a movie
app.put("/api/movies/:episode/likes", async (req, res) => {
  const { likes } = req.body;
  if (likes === undefined) return res.status(400).json({ message: "Likes count required" });

  const movie = await Movie.findOneAndUpdate(
    { episode: req.params.episode },
    { likes },
    { new: true, lean: true }
  );
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
});

app.put("/api/movies/:episode/dislikes", async (req, res) => {
  const { dislikes } = req.body;
  if (dislikes === undefined) return res.status(400).json({ message: "Dislikes count required" });

  const movie = await Movie.findOneAndUpdate(
    { episode: req.params.episode },
    { dislikes },
    { new: true, lean: true }
  );
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
});

// CONNECT DB and start server
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Mongo connected");
    await seedMoviesIfEmpty();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error:", err);
  });
