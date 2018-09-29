const Authentication = require('../controllers/Authentication');
const requireAuth = require('../middlewares/requireAuth');
const { validateEmail } = require('../services/Validator');
const User = require('../models/User');

module.exports = app => {
    app.post('/api/login', Authentication.handleSignIn);
    app.post('/api/register', Authentication.handleRegister);

    app.post('/api/profile/:username', requireAuth, (req, res) => {
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

    app.get('/api/profile/:username', requireAuth, async (req, res) => {
        const { username } = req.params;

        return await User.findOne({ username }).then(user => {
            res.json(user);
        }).catch(()=> res.status(404).send('User not found'));
    });
};
