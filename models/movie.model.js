import { model, Schema } from "mongoose";

const schema = new Schema({
  title: {
    type: String,
    required: true, 
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});


const Movie = model("movie", schema);
export default Movie;
