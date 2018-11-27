import { redisClient, } from "../controllers/AuthController";

export default(req, res, next) => {
    const { authorization, } = req.headers;

    if (!authorization) {
        return res.status(401).send("Unauthorized");
    }
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).send("Unauthorized");
        }
        return next();
    });
};
