import { merge } from 'lodash';

let envConfig = {};

if (process.env.NODE_ENV === 'production') {
    envConfig = require('./prod').config;
} else {
    envConfig = require('./dev').config;
}

console.log(process.env.NODE_ENV);
console.log(merge(envConfig));

export default merge(envConfig);
