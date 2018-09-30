const mongoose = require('mongoose');
const { Schema } = mongoose;

const serieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    genre: [{
        type: String,
        required: true
    }],
    year: {
        type: String,
        required: true
    },
    released: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    plot: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 10,
        min: 0,
        max: 100
    }
});

const SerieModel = mongoose.model('series', serieSchema);

module.exports = SerieModel;
