import redis from 'redis';
import jwt from 'jsonwebtoken';
import config from '../config';
import { validateEmail } from '../helpers/Validator';
import { User } from '../models/User';
import gravatar from 'gravatar';
import { getEntryByValue } from './QueryController';
const stripe = require("stripe")(config.stripeKeySecret);

const redisClient = redis.createClient(config.REDIS_URL);

const signToken = username => {
    const jwtPayload = { username };
    return jwt.sign(jwtPayload, config.jwtKey, { expiresIn: '2 days' });
};

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value.toString()));

const createSession = (user) => {
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => {
            return { success: 'true', userId: id, token, user }
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

            return user.id && user.email ? createSession(user)
                .then(session => res.json(session))
                .catch(err => res.status(400).send(err)) : Promise.reject(user);
        });
    }).catch(() => res.status(404).send('User not found'));
};

const handleRegister = async (req, res, next) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(422).send('Incorrect form submission');
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
        return res.status(422).send('Email or Username is already in use');
    }

    const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    });
    const user = new User({ email, username, password, avatar });

    await user.save(err => {
        if (err) { next(err); }

        res.json(user);
    });
};

const handleGetProfile = async (req, res, next) => User.findById(req.params.id).then(user => res.json(user)).catch(() => res.status(404).send('User not found'));

const handleUpdateProfile = async (req, res, next) => {
    const { email, username } = req.body;

    if (!validateEmail(email)) {
        return res.status(403).send('Please type a correct email type');
    }

    return User.findOneAndUpdate({ _id: req.params.id }, { $set: { email, username } }, { new: true }).exec((err, user) => {
        if (err) { return res.status(500).json('Username or Email already exists'); }

        res.json(user);
    });
};

const handleAddUserBalance = async (req, res) => {
    const { amount, id, userId } = req.body;

    await stripe.charges.create({
        amount: amount * 100,
        currency: 'eur',
        description: `€${amount} Deposit`,
        source: id
    });

    const user = await User.findById(userId);
    user.balance += amount;
    await user.save().then(newUser => res.json(newUser)).catch(() => res.status(404).send('Error saving new user data'));
};

export {
    handleSignIn,
    handleRegister,
    handleGetProfile,
    handleUpdateProfile,
    handleAddUserBalance,
    redisClient
};
