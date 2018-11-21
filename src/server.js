import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import config from "./config";

import {
    authRouter, movieRouter, rentalRouter, serieRouter, recommendationRouter
} from "./routes";

require("./models/User");
require("./models/Rental");
require("./models/Movie");
require("./models/Serie");

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useCreateIndex: true }).catch(err => console.error(err));

const app = express();

let allowedOrigins = ['http://localhost:3000', 'http://movieholic.herokuapp.com', 'https://movieholic.herokuapp.com'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
        return callback(null, true);
    }
}));
app.use(bodyParser.json());
app.use('/api', [authRouter, movieRouter, rentalRouter, serieRouter, recommendationRouter]);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
