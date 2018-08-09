const Authentication = require('../controllers/Authentication');
const requireAuth = require('../middlewares/requireAuth');

module.exports = app => {
    app.post('/api/login', Authentication.handleSignIn);

    app.post('/api/register', Authentication.handleRegister);

    app.post('/api/logout', (req, res) => {

        res.redirect('/');
    });

    app.get('/api/profile/:id', requireAuth, (req, res) => {

    });
};
