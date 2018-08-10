const Authentication = require('../controllers/Authentication');
const requireAuth = require('../middlewares/requireAuth');
const User = require('../models/Users');

module.exports = app => {
    app.post('/api/login', Authentication.handleSignIn);

    app.post('/api/register', Authentication.handleRegister);

    app.get('/api/profile/:id', requireAuth, async (req, res) => {
        const { id } = req.params;

        return await User.findOne({ _id: id }).then(user => {
            res.send(user);
        }).catch(()=> res.status(404).send('User not found'));
    });
};
