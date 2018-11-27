import { Rental } from '../models/Rental';
import { User } from '../models/User';

export const getLatestOrders = async (req, res) => {
    const latestOrders = await Rental.find().sort('-dateOrdered').populate('customer').populate('movies').populate('series');
    res.json(latestOrders);
};

export const getLatestMembers = async (req, res) => {
    const latestMembers = await User.find().sort('-joinedAt');
    res.json(latestMembers);
};

const countMostRentedData = array_of_titles => {
    return array_of_titles.reduce((countWords, word) => {
        countWords[word.title] = ++countWords[word.title] || 1;
        return countWords;
    }, {});
};

export const mostRented = async (req, res) => {
    const allOrders = await Rental.find().sort('-dateOrdered').populate('movies').populate('series');
    const allOrderMovies = countMostRentedData(allOrders.movies);
    const allOrderSeries = countMostRentedData(allOrders.series);

    res.json({ allOrderMovies, allOrderSeries });
};