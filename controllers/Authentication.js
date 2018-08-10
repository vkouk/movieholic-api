const jwt = require('jsonwebtoken');
const redis = require('redis');
const keys = require('../config/keys');
const User = require('../models/Users');
const redisClient = redis.createClient(keys.redisURI);

const signToken = username => {
    const jwtPayload = { username };
    return jwt.sign(jwtPayload, keys.jwtKey, { expiresIn: '2 days'});
};

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value.toString()));

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
        return res.json({ id: reply });
    });
};

const handleSignIn = (req, res) => {
    const { email, password } = req.body;
    const { authorization } = req.headers;

    if (!email || !password) {
        return res.status(422).send('Incorrect form submission');
    }

    return authorization ? getAuthTokenId(req, res) : User.findOne({ email }).then(user => {
        user.comparePassword(password, (err, isMatch) => {
            if (err || !isMatch) { return res.status(401).send("Password doesn't match"); }

            return user._id && user.email ? createSession(user)
                .then(session => res.json(session))
                .catch(err => res.status(400).send(err)) : Promise.reject(user);
        });
    }).catch(error => res.status(400).send(error));
};

const handleRegister = async(req, res, next) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(422).send('Incorrect form submission');
    }

    const existingUser = await User.findOne({ $or: [ { email }, { username }]});

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
