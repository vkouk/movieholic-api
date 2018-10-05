import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';
import config from './config';
import path from 'path';

import { authRouter, movieRouter, rentalRouter, serieRouter } from './routes';

require('./models/User');
require('./models/Rental');
require('./models/Movie');
require('./models/Serie');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useCreateIndex: true }).catch(err => console.error(err));

const app = express();

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 3 * 24 * 60 * 60 * 1000,
        keys: [config.cookieKey]
    })
);

app.use('/api', [ authRouter, movieRouter, rentalRouter, serieRouter ]);

const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, 'dist')));
app.listen(PORT);