import { Movie } from '../models/Movie';
import { fetchMovieFromApi } from '../services/Api';
import { getEntryByTitleParam, getAll } from '../controllers/QueryController';
import { compareData } from '../services/Validator';
import moment from 'moment';

const movieData = movie => ({
    title: movie.Title,
    genre: movie.Genre,
    writer: movie.Writer,
    released: moment(new Date(movie.Released)).format('DD/MMM/YYYY'),
    rating: movie.imdbRating,
    poster: movie.Poster,
    plot: movie.Plot
});

export const getAndStoreMovie = async (req, res) => {
    const { movieTitle, movieYear } = req.body;
    const movie = await fetchMovieFromApi(movieTitle, movieYear);
    const existingMovie = await Movie.findOne({ title: movie.Title });

    if (!movieTitle) {
        return res.status(403).send('Please Enter The Movie Title');
    }

    if (movie.Error || movie.Response === 'False') {
        return res.status(404).send('Movie Not Found');
    }

    if (existingMovie) {
        if (compareData(existingMovie, movie)) {
            return res.json(existingMovie);
        }

        const updateMovieData = movieData(movie);
        return Movie.findOneAndUpdate({ title: movie.Title }, { $set: updateMovieData }, { new: true }).then(movieRecord => res.json(movieRecord));
    }

    const newMovieEntry = movieData(movie);
    return new Movie(newMovieEntry).save().then(movie => res.json(movie));
};

export const getMovieByTitleParam = (req, res, next) => getEntryByTitleParam(Movie)(req,res,next);
export const getAllMovies = (req, res, next) => getAll(Movie)(req,res,next);
