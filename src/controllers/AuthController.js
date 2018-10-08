import redis from 'redis';
import jwt from 'jsonwebtoken';
import config from '../config';
import { User } from '../models/User';
import gravatar from 'gravatar';

const redisClient = redis.createClient(config.REDIS_URL);

const signToken = username => {
    const jwtPayload = { username };
    return jwt.sign(jwtPayload, config.jwtKey, { expiresIn: '2 days'});
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

export { 
    handleSignIn,
    handleRegister,
    redisClient 
};
