import { Rental } from '../models/Rental';
import _ from 'lodash';

const calculateAmount = data => {
    if (data.movie && !data.serie) {
        data.returnFee(_.toNumber(data.movie.rating));
    } else if (data.serie && !data.movie) {
        data.returnFee(_.toNumber(data.serie.rating));
    } else {
        data.map(record => {
            if (record.movie && !record.serie) {
                record.returnFee(_.toNumber(record.movie.rating));
            } else if (record.serie && !record.movie) {
                record.returnFee(_.toNumber(record.serie.rating));
            } else {
                record.returnFee(_.toNumber(record.movie.rating) + _.toNumber(record.serie.rating));
            }
        })
    }
};

export const storeRent = (req, res) => {

};

export const getAllRents = (req, res, next) => {
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