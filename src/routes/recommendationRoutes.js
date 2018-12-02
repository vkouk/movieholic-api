import express from "express";
import Reccomendation from "../services/Reccomendation";
import requireAuth from "../middlewares/requireAuth";

export const recommendationRouter = express.Router();

recommendationRouter.post("/recommendations", requireAuth, Reccomendation);
