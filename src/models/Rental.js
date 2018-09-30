const mongoose = require('mongoose');
const { Schema } = mongoose;
const Movie = require('./Movie');
const Serie = require('./Serie');

const rentalSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'movies'
    },
    serie: {
        type: Schema.Types.ObjectId,
        ref: 'series'
    },
    rentalFee: {
        type: Number,
        min: 0
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    },
    dateReturned: {
        type: Date
    }
});

const RentalModel = mongoose.model('rental', rentalSchema);

module.exports = RentalModel;
