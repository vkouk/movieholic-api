const Movie = require('../models/Movie');
const Api = require('../services/Api');
const { getOne, getAll } = require('./QueryController');
const { compareData } = require('../services/Validator');
const moment = require('moment');

const getAndStoreMovie = async (req, res) => {
    const { movieTitle, movieYear } = req.body;
    const movie = await Api.fetchMovieFromApi(movieTitle, movieYear);
    const existingMovie = await Movie.findOne({ title: movie.Title });

    if (!movieTitle) {
        return res.status(403).send('Please Enter The Movie Title');
    }

    if (movie.Error || movie.Response === 'False') {
        return res.status(403).send('Movie Not Found');
    }

    if (existingMovie) {
        if (compareData(existingMovie, movie)) {
            return res.json(existingMovie);
        }

        const updateMovieData = {
            title: movie.Title,
            genre: movie.Genre.split(' ,'),
            released: moment(new Date(movie.Released)).format('DD/MMM/YYYY'),
            poster: movie.Poster,
            plot: movie.Plot
        }
        return Movie.findOneAndUpdate({ title: movie.Title }, { $set: updateMovieData }, { new: true }).then(movieRecord => res.json(movieRecord));
    }

    const newMovieEntry = {
        title: movie.Title,
        genre: movie.Genre.split(' ,'),
        released: moment(new Date(movie.Released)).format('DD/MMM/YYYY'),
        poster: movie.Poster,
        plot: movie.Plot
    };

    return await new Movie(newMovieEntry).save().then(movie => res.json(movie));
}

const getMovie = (req, res, next) => getOne(Movie)(req,res,next);
const getAllMovies = (req, res, next) => getAll(Movie)(req,res,next);

module.exports = {
    getAndStoreMovie,
    getMovie,
    getAllMovies
}