import { Movie } from "../models/Movie";
import {
  getEntryByTitleParam,
  getAll,
  getAndStoreData
} from "../controllers/QueryController";

export const getAndStoreMovie = async (req, res) =>
  getAndStoreData("movie", Movie)(req, res);
export const getMovieByTitleParam = (req, res, next) =>
  getEntryByTitleParam(Movie)(req, res, next);
export const getAllMovies = (req, res, next) => getAll(Movie)(req, res, next);
