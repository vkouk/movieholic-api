import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

const rentalSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    movies: [{
        type: Schema.Types.ObjectId,
        ref: 'movies'
    }],
    series: [{
        type: Schema.Types.ObjectId,
        ref: 'series'
    }],
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

rentalSchema.methods.returnRental = function (movies, series) {
    this.dateReturned = new Date();

    const moviesRating = movies.reduce((acc, curr) => acc + parseFloat(curr.rating), 0);
    const seriesRating = series.reduce((acc, curr) => acc + parseFloat(curr.rating), 0);
    const rentalRating = parseFloat(((moviesRating + seriesRating) / 10).toFixed(2));
    const rentalDays = moment().diff(this.dateOrdered, 'days');
    
    this.rentalFee = (rentalDays * rentalRating * 0.9).toFixed(2);
}

export const Rental = mongoose.model('rental', rentalSchema);
