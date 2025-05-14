import Movie from "../models/movie.model.js";

export const movieIndex = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const movieCreate = async (req, res) => {
  console.log("Received body:", req.body);
  const newMovie = new Movie({
    title: req.body.title,
    description: req.body.description,
  });
  try {
    const movie = await newMovie.save();
    res.status(201).json(movie);
  } catch (error) {
    console.error("Error saving movie:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const movieUpdate = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Cannot Find Movie" });
    }

    movie.title = req.body.title ?? movie.title;
    movie.description = req.body.description ?? movie.description;

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const MovieDetails = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Cannot Find Movie" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const movieDelete = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Cannot Find Movie" });
    }
    res.json({ message: "Movie Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
