import { model, Schema } from "mongoose";

const schema = new Schema({
  title: String,
  description: String,
});
const Movie = model("movie", schema);
export default Movie;
