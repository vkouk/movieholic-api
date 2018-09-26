const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const keys = require('./config/keys');

require('./models/User');
require('./models/Order');
require('./models/Movie');
require('./models/Serie');

const redisClient = redis.createClient(keys.redisURI);

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

module.exports = { redisClient };
