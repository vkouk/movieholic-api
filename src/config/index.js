let envConfig = {};

if (process.env.NODE_ENV === 'production') {
    envConfig = require('./prod').config;
} else {
    envConfig = require('./dev').config;
}

console.log(process.env.NODE_ENV);
console.log(envConfig);

export default envConfig;
