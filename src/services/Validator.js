const moment = require('moment');
const _ = require('lodash');

const validateEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const compareData = (existingMovie, apiMovie) => {
    const apiMovieDateReleased = moment(new Date(apiMovie.Released)).format('DD/MMM/YYYY');
    //TODO: Compare Dates.

    return ( (apiMovie.Title !== existingMovie.title) || (!_.isEqual(existingMovie.genre.map(genre => genre), apiMovie.Genre.split(' ,'))) || (apiMovie.Poster !== existingMovie.poster) || (apiMovie.Plot !== existingMovie.plot)) ? false : true;
}

module.exports = {
    validateEmail,
    compareData
}