import { Rental } from '../models/Rental';
import { Movie } from '../models/Movie';
import { Serie } from '../models/Serie';
import { User } from '../models/User';
import _ from 'lodash';

export const storeRent = async (req, res) => {
    const { userId, moviesId, seriesId } = req.body;

    const user = await User.findById(userId);
    const movies = await Movie.find({
        $and: [
            { _id: { $in: moviesId } },
            { stock: { $gt: 0 } }
        ]
    });
    const series = await Serie.find({
        $and: [
            { _id: { $in: seriesId } },
            { stock: { $gt: 0 } }
        ]
    });

    if (!user || (movies.length <= 0 && series.length <= 0)) {
        return res.status(404).send('Seems something is missing or products are out of stock');
    }

    if (user.balance <= 0) {
        return res.status(403).send("Sorry seems your balance isn't enough");
    }

    const rental = new Rental({ customer: userId });

    return rental.save()
        .then(rent => {
            Rental.findByIdAndUpdate(rent._id, { $push: { movies: { $each: moviesId }, series: { $each: seriesId } } }, { new: true })
                .exec((err, rent) => {
                    if (err) { return res.status(503).json(err); }

                    rent.movies.map(movie => {
                        Movie.update({ _id: movie._id }, { $inc: { stock: -1 } }, err => {
                            if (err) { return res.status(503).send('Error updating movie.'); }
                        });
                    });
                    rent.series.map(serie => {
                        Serie.update({ _id: serie._id }, { $inc: { stock: -1 } }, err => {
                            if (err) { return res.status(503).send('Error updating serie.'); }
                        });
                    });

                    res.json(rent);
                });
        })
        .catch(() => res.status(503).send('Error saving your renting.'));
};

export const getAllRents = (req, res) => {
    return Rental.find({}).populate('customer').populate('movies').populate('series')
        .exec((err, data) => {
            if (err) throw err;
            res.json(data);
        });
};

export const getRentById = (req, res) => {
    return Rental.findById(req.params.id).populate('customer').populate('movies').populate('series')
        .exec((err, data) => {
            if (err) throw err;
            res.json(data);
        });
};

export const getRentByUser = (req, res) => {
    return Rental.find({ customer: req.params.id }).populate('customer').populate('movies').populate('series')
        .exec((err, data) => {
            if (err) throw err;
            res.json(data);
        });
};