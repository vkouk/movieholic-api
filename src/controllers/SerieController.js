import { Serie } from "../models/Serie";
import {
  getEntryByTitleParam,
  getAll,
  getAndStoreData
} from "../controllers/QueryController";

export const getAndStoreSerie = async (req, res) =>
  getAndStoreData("serie", Serie)(req, res);
export const getSerieByTitleParam = (req, res, next) =>
  getEntryByTitleParam(Serie)(req, res, next);
export const getAllSeries = (req, res, next) => getAll(Serie)(req, res, next);
