const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const keys = require('./config/keys');

require('./models/Users');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true }).catch(err => console.error(err));

const app = express();

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 3 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
