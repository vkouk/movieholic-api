import axios from 'axios';
import config from '../config';

const apiLink = 'http://www.omdbapi.com';
const apikey = config.omdbApi;

export const fetchFromApi = (title, year, dataType) => {
    if (dataType === 'movie') {
        return axios.get(`${apiLink}/?t=${title}&type=movie&y=${year}&plot=short&apiKey=${apikey}`)
            .then(({ data }) => data)
            .catch(err => err);
    } else if (dataType === 'serie') {
        return axios.get(`${apiLink}/?t=${title}&type=series&plot=short&apiKey=${apikey}`)
            .then(({ data }) => data)
            .catch(err => err);
    }
};