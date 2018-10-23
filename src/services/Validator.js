import _ from "lodash";

export const validateEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const compareData = (existingMovie, apiMovie) => (!(((apiMovie.Title !== existingMovie.title) || (!_.isEqual(existingMovie.genre.map(genre => genre), apiMovie.Genre.split(" ,"))) || (!_.isEqual(existingMovie.rating, apiMovie.imdbRating)) || (apiMovie.Poster !== existingMovie.poster) || (apiMovie.Plot !== existingMovie.plot))));
