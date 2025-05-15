import Movie from "../models/movie.model.js";

export const getMovies = async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
};

export const getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
};

export const createMovie = async (req, res) => {
  const { title, description } = req.body;
  const movie = new Movie({ title, description }); 
  const saved = await movie.save();
  res.status(201).json(saved);
};

export const updateMovie = async (req, res) => {
  const { title, description } = req.body;
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: "Movie not found" });

  movie.title = title ?? movie.title;
  movie.description = description ?? movie.description;

  const updated = await movie.save();
  res.json(updated);
};

export const deleteMovie = async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json({ message: "Movie deleted successfully" });
};
