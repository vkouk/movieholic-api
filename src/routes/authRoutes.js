const Authentication = require('../controllers/Authentication');
const requireAuth = require('../middlewares/requireAuth');
const User = require('../models/User');

module.exports = app => {
    app.post('/api/login', Authentication.handleSignIn);

    app.post('/api/register', Authentication.handleRegister);

    app.post('/api/profile/:username', requireAuth, async (req, res) => {
        const { username } = req.params;


    });

    app.get('/api/profile/:username', requireAuth, async (req, res) => {
        const { username } = req.params;

        return await User.findOne({ username }).then(user => {
            res.send(user);
        }).catch(()=> res.status(404).send('User not found'));
    });
};
