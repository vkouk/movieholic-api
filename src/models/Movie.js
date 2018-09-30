const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    genre: [{
        type: String,
        required: true
    }],
    released: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    plot: {
        type: String
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
        min: 0,
        max: 100
    }
});

const MovieModel = mongoose.model('movies', movieSchema);

module.exports = MovieModel;
