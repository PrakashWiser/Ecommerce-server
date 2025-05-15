import express from "express";
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controller.js";

const router = express.Router();

router.route("/").get(getMovies).post(createMovie);

router.route("/:id").get(getMovieById).put(updateMovie).delete(deleteMovie);

export default router;
