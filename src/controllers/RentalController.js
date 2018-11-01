import { Rental } from '../models/Rental';
import { Movie } from '../models/Movie';
import { Serie } from '../models/Serie';
import { User } from '../models/User';
import _ from 'lodash';

const calculateAmount = data => {
    return data.map(record => {
        if (record.movie && !record.serie) {
            record.returnFee(_.toNumber(record.movie.rating));
        } else if (record.serie && !record.movie) {
            record.returnFee(_.toNumber(record.serie.rating));
        } else {
            record.returnFee(_.toNumber(record.movie.rating) + _.toNumber(record.serie.rating));
        }
    });
};

export const storeRent = async (req, res) => {
    const { userId, movieId, serieId } = req.body;

    const user = await User.findById(userId);
    const movie = await Movie.findById(movieId);
    const serie = await Serie.findById(serieId);

    if (!user || (!movie && !serie)) {
        return res.status(404).send('Seems something is missing');
    }

    if (user.balance <= 0) {
        return res.status(403).send("Sorry seems your balance isn't enough");
    }

    if (movie.stock <= 0 || serie.stock <= 0) {
        return res.status(403).send('Oups, seems we have run out of stock of this product');
    }

    const rental = new Rental({ customer: userId });
    rental.movie.unshift(movieId);
    rental.serie.unshift(serieId);

    return rental.save().then(rent => res.json(rent));
};

export const getAllRents = (req, res) => {
    return Rental.find({}).populate('customer').populate('movie').populate('serie')
        .exec((err, data) => {
            if (err) throw err;
            calculateAmount(data);
            res.json(data);
        });
};

export const getRentById = (req, res) => {
    return Rental.findById(req.params.id).populate('customer').populate('movie').populate('serie')
        .exec((err, data) => {
            if (err) throw err;
            calculateAmount(data);
            res.json(data);
        });
};