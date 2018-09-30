const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const authRouter = require('./routes/authRoutes');
const rentalRouter = require('./routes/rentalRoutes');
const movieRouter = require('./routes/movieRoutes');
const serieRouter = require('./routes/serieRoutes');

require('./models/User');
require('./models/Rental');
require('./models/Movie');
require('./models/Serie');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useCreateIndex: true }).catch(err => console.error(err));

const app = express();

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 3 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

app.use('/api', [authRouter, rentalRouter, movieRouter, serieRouter]);

const PORT = process.env.PORT || 5000;
app.listen(PORT);