export const config = {
    mongoURI: process.env.mongoURI,
    REDIS_URL: process.env.REDIS_URL,
    jwtKey: process.env.jwtKey,
    omdbApi: process.env.omdbApi,
    stripeKeyPublishable: process.env.stripeKeyPublishable,
    stripeKeySecret: process.env.stripeKeySecret
};
