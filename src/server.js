import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import config from "./config";

import {
    authRouter, movieRouter, rentalRouter, serieRouter
} from "./routes";

require("./models/User");
require("./models/Rental");
require("./models/Movie");
require("./models/Serie");

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useCreateIndex: true }).catch(err => console.error(err));

const app = express();

const whitelist = ['http://localhost:3000', 'http://movieholic.herokuapp.com', 'https://movieholic.herokuapp.com'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 !! !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use(cors(corsOptions.origin()));
app.use(bodyParser.json());
app.use('/api', [authRouter, movieRouter, rentalRouter, serieRouter]);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
