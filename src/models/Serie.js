const mongoose = require('mongoose');
const { Schema } = mongoose;

const serieSchema = new Schema({
    title: {
        type: String
    },
    genre: {
        type: [String]
    },
    year: {
        type: String
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

module.exports = serieSchema;
