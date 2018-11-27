import express from 'express';
import { getLatestOrders, getLatestMembers } from '../controllers/DashboardController';
import requireAdmin from '../middlewares/requireAdmin';

export const dashboardRouter = express.Router();

dashboardRouter.get('/dashboard/orders', requireAdmin, getLatestOrders);
dashboardRouter.get('/dashboard/members', requireAdmin, getLatestMembers);