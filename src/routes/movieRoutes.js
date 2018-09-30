const express = require('express');
const movieRouter = express.Router();
const MovieController = require('../controllers/MovieController');

movieRouter.route('/movie')
    .get(MovieController.getAllMovies)
    .post(MovieController.getAndStoreMovie);

movieRouter.route('/movie/:title')
    .get(MovieController.getMovie)

module.exports = movieRouter;