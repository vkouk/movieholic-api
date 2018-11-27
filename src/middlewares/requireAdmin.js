import { redisClient, } from "../controllers/AuthController";
import { User } from "../models/User";

export default(req, res, next) => {
    const { authorization, } = req.headers;

    if (!authorization) {
        return res.status(401).send("Unauthorized");
    }
    return redisClient.get(authorization, async (err, reply) => {
        const user = await User.findOne({ _id: reply });

        if (err || !reply || !user.isAdmin) {
            return res.status(401).send("Unauthorized Admin");
        }
        return next();
    });
};
