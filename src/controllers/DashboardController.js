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
        countWords[word] = ++countWords[word] || 1;
        return countWords;
    }, {});
};

const sortObject = obj => {
    let sortable = [];
    for (let count in obj) {
        sortable.push({ title: count, count: obj[count] });
    }

    return sortable.sort((a, b) => b.count - a.count);
};

export const mostRented = async (req, res) => {
    const allOrders = await Rental.find().sort('-dateOrdered').populate('movies').populate('series');
    let allOrderMovies = [];
    let allOrderSeries = [];


    allOrders.map(order => {
        allOrderMovies.push(...order.movies.map(movie => movie.title));
        allOrderSeries.push(...order.series.map(serie => serie.title));
    });
    res.json({ allOrderMovies: sortObject(countMostRentedData(allOrderMovies)), allOrderSeries: sortObject(countMostRentedData(allOrderSeries)) });
};