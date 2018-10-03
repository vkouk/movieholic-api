import mongoose, { Schema } from 'mongoose';

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

export const Rental = mongoose.model('rental', rentalSchema);
