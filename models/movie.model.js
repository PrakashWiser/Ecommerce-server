import { model, Schema } from "mongoose";

const movieSchema = new Schema({
  title: { type: String, required: true },
  description: String,
});

const Movie = model("movie", movieSchema);
export default Movie;
