import _ from 'lodash';
import moment from 'moment';
import { fetchFromApi } from '../services/Api';
import { compareData } from '../helpers/Validator';

export const getEntryByTitleParam = model => async (req, res, next) => {
    return await model.findOne({ title: req.params.title })
        .then(doc => res.json(doc))
        .catch(error => next(error));
};

export const getEntryByIdParam = model => async (req, res, next) => {
    return await model.findOne({ _id: req.params.id })
        .then(doc => res.json(doc))
        .catch(error => next(error));
};

export const getEntryByValue = (model, value) => async (req, res, next) => {
    return await model.findOne({ $or: [{ id: value }, { title: value }, { email: value }, { username: value }] })
        .then(doc => res.json(doc))
        .catch(error => next(error));
};

export const getAll = model => async (req, res, next) => {
    return await model.find({})
        .populate('customer')
        .populate('movie')
        .populate('serie')
        .then(doc => res.json(doc))
        .catch(error => next(error));
};

const apiData = model => ({
    title: model.Title,
    genre: model.Genre,
    writer: model.Writer,
    released: moment(new Date(model.Released)).format('DD/MMM/YYYY'),
    rating: model.imdbRating,
    poster: model.Poster,
    plot: model.Plot
});

export const getAndStoreData = (dataType, model) => async (req, res) => {
    const { title, year } = req.body;
    const fetchedData = await fetchFromApi(title, year, dataType);
    const existingData = await model.findOne({ title: fetchedData.Title });

    if (!title) {
        return res.status(404).send(`Please Enter The ${_.capitalize(dataType)} Title`);
    }

    if (fetchedData.Error || fetchedData.Response === 'False') {
        return res.status(404).send(`${_.capitalize(dataType)} Not Found`);
    }

    if (existingData) {
        if (compareData(existingData, fetchedData)) {
            return res.json(existingData);
        }
        const updatedData = apiData(fetchedData);
        return model.findOneAndUpdate({ title: fetchedData.Title }, { $set: updatedData }, { new: true }).then(dataRecord => res.json(dataRecord));
    }

    const newDataEntry = apiData(fetchedData);
    return new model(newDataEntry).save().then(record => res.json(record));
};