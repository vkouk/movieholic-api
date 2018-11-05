import express from "express";
import requireAuth from '../middlewares/requireAuth';
import { getAllRents, getRentById, storeRent, getRentByUser } from '../controllers/RentalController';

export const rentalRouter = express.Router();

rentalRouter.route('/rent')
    .get(requireAuth, getAllRents)
    .post(requireAuth, storeRent);

rentalRouter.get('/rent/:id', requireAuth, getRentById);
rentalRouter.post('/rent/user', requireAuth, getRentByUser);