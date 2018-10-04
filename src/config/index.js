const env = process.env.NODE_ENV;
let envConfig = {};

switch (env) {
    case 'development':
    case 'dev':
        envConfig = require('./dev').config;
        break;
    case 'prod':
    case 'production':
        envConfig = require('./prod').config;
        break;
    default:
        envConfig = require('./dev').config
}

export default envConfig;
