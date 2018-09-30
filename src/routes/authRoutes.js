const express = require('express');
const authRouter = express.Router();
const Authentication = require('../controllers/Authentication');
const requireAuth = require('../middlewares/requireAuth');
const { validateEmail } = require('../services/Validator');
const User = require('../models/User');

authRouter.post('/user/login', Authentication.handleSignIn);
authRouter.post('/user/register', Authentication.handleRegister);

authRouter.post('/user/profile/:username', requireAuth, (req, res) => {
    const { email, username } = req.body;

    if (!validateEmail(email)) {
        return res.status(403).send('Please type a correct email type');
    }

    return User.findOneAndUpdate({ username: req.params.username }, { $set: { email, username } }, { new: true }).then(async user => {
        await user.save(err => {
            if (err) throw err;

            res.json(user);
        });
    }).catch(() => res.status(400).send('User not found'));
});

authRouter.get('/user/profile/:username', requireAuth, async (req, res) => {
    const { username } = req.params;

    return await User.findOne({ username }).then(user => {
        res.json(user);
    }).catch(() => res.status(404).send('User not found'));
});

module.exports = authRouter;
