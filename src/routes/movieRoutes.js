const express = require('express');
const movieRouter = express.Router();
const MovieController = require('../controllers/MovieController');

movieRouter.post('/movie', MovieController.getMovie);

module.exports = movieRouter;