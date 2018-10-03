import axios from 'axios';
import config from '../config';

const apiLink = 'http://www.omdbapi.com';
const apikey = config.omdbApi;

export const fetchMovieFromApi = (movieTitle, movieYear) => {
    return axios.get(`${apiLink}/?t=${movieTitle}&type=movie&y=${movieYear}&plot=short&apiKey=${apikey}`)
        .then(({ data }) => data)
        .catch(err => err);
}

export const fetchSerieFromApi = (serieTitle, serieYear) => {

}