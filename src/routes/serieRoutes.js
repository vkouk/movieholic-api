import express from "express";
import { getAllSeries, getAndStoreSerie, getSerieByTitleParam, } from "../controllers/SerieController";

export const serieRouter = express.Router();

serieRouter.route("/serie")
    .get(getAllSeries)
    .post(getAndStoreSerie);

serieRouter.route("/serie/:title")
    .get(getSerieByTitleParam);
