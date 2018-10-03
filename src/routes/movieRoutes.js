import express from 'express';
import { getAllMovies, getAndStoreMovie, getMovie } from '../controllers/MovieController';

export const movieRouter = express.Router();

movieRouter.route('/movie')
    .get(getAllMovies)
    .post(getAndStoreMovie);

movieRouter.route('/movie/:title')
    .get(getMovie);