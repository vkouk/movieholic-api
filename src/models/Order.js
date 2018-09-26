const mongoose = require('mongoose');
const { Schema } = mongoose;
const Movie = require('./Movie');
const Serie = require('./Serie');

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    movie: [Movie],
    serie: [Serie],
    dateOrdered: {
        type: Date
    },
    dateUpdated: {
        type: Date
    }
});

const OrdersModel = mongoose.model('orders', orderSchema);

module.exports = OrdersModel;
