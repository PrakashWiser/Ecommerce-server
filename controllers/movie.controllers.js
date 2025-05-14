import Movie from "../models/movie.model.js";
export const movieIndex = (req, res) => {
  res.send("Get all list");
};

export const movieCreate = async (req, res) => {

  const newMovie = new Movie({
    title: req.body.title,
    description: req.body.description,
  });
  
  try {
    const movie = await newMovie.save();
    return res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const movieUpdate = (req, res) => {
  res.send("Movie Updated");
};

export const movieDelete = (req, res) => {
  res.send("Movie Deleted");
};
