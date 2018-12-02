import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  writer: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  released: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  plot: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 10,
    min: 0,
    max: 100
  }
});

export const Movie = mongoose.model("movies", movieSchema);
