const axios = require('axios');
const keys = require('../config/keys');

const apiLink = 'http://www.omdbapi.com';
const apikey = keys.omdbApi;

const fetchMovieFromApi = async (movieTitle, movieYear) => {
    return await axios.get(`${apiLink}/?t=${movieTitle}&type=movie&y=${movieYear}&plot=short&apiKey=${apikey}`)
        .then(({ data }) => data)
        .catch(err => err);
}

const fetchSerieFromApi = async (serieTitle, serieYear) => {

}

module.exports = {
    fetchMovieFromApi,
    fetchSerieFromApi
}