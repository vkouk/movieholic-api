const getOne = model => async (req, res, next) => {
    return await model.findOne({ title: req.params.title })
        .then(doc => res.json(doc))
        .catch(error => next(error));
}

const getAll = model => async (req, res, next) => {
    return await model.find({})
        .then(doc => res.json(doc))
        .catch(error => next(error));
}

module.exports = {
    getOne,
    getAll
}