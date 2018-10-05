import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';
import config from './config';

import { authRouter, movieRouter, rentalRouter, serieRouter } from './routes';

require('./models/User');
require('./models/Rental');
require('./models/Movie');
require('./models/Serie');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useCreateIndex: true }).catch(err => console.error(err));

const app = express();
const server = http.createServer(app);
let currentApp = app;

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 3 * 24 * 60 * 60 * 1000,
        keys: [config.cookieKey]
    })
);

app.use('/api', [authRouter, movieRouter, rentalRouter, serieRouter]);

if (module.hot) {
    module.hot.accept(['./server'], () => {
        server.removeListener('request', currentApp);
        server.on('request', app);
        currentApp = app;
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);