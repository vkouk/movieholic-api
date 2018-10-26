import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

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

rentalSchema.methods.returnFee = function(rating) {
    this.dateReturned = new Date();
    const rentalRating = (rating / 10).toFixed(2);
    const rentalDays = moment().diff(this.dateOrdered, 'days');

    this.rentalFee = (rentalRating * rentalDays * 0.8).toFixed(2);
};

export const Rental = mongoose.model('rental', rentalSchema);
