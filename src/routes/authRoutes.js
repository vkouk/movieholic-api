import express from 'express';
import { handleSignIn, handleRegister } from '../controllers/AuthController'; 
import requireAuth from '../middlewares/requireAuth';
import { validateEmail } from '../services/Validator';
import { User } from '../models/User';

export const authRouter = express.Router();

authRouter.post('/user/login', handleSignIn);
authRouter.post('/user/register', handleRegister);

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