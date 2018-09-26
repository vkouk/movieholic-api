const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
    title: {
        type: String
    },
    genre: {
        type: [String]
    },
    released: {
        type: String
    },
    poster: {
        type: String
    },
    plot: {
        type: String
    }
});

module.exports = movieSchema;
