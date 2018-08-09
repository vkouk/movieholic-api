const jwt = require('jsonwebtoken');
const redis = require('redis');
const keys = require('../config/keys');
const User = require('../models/Users');
const redisClient = redis.createClient(keys.redisURI);

const signToken = username => {
    const jwtPayload = { username };
    return jwt.sign(jwtPayload, keys.jwtKey, { expiresIn: '2 days'});
};

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const createSession = (user) => {
    const { email, _id } = user;
    const token = signToken(email);
    return setToken(token, _id)
        .then(() => {
            return { success: 'true', userId: _id, token, user }
        })
        .catch(console.log);
};

const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).send('Unauthorized');
        }
        return res.json({id: reply})
    });
};

const handleSignIn = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return Promise.reject('incorrect form submission');
    }
};

const handleRegister = async(req, res, next) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(422).send('Incorrect form submission');
    }

    const existingUser = await User.findOne({ email, username });

    if (existingUser) {
        return res.status(422).send('Email or Username is already in use');
    }

    const user = new User({ email, username, password, joinedAt: new Date() });

    await user.save(err => {
        if (err) { next(err); }

        res.send(user);
    });
};

module.exports = {
    handleSignIn,
    handleRegister,
    redisClient
};
