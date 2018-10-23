let envConfig = {};

if (process.env.NODE_ENV === "production") {
    envConfig = require("./prod").config;
} else {
    envConfig = require("./dev").config;
}

export default envConfig;
