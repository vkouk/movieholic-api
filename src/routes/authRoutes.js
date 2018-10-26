import express from 'express';
import { handleSignIn, handleRegister, handleGetProfile, handleUpdateProfile } from '../controllers/AuthController';
import requireAuth from '../middlewares/requireAuth';

export const authRouter = express.Router();

authRouter.post('/user/login', handleSignIn);
authRouter.post('/user/register', handleRegister);

authRouter.route('/user/profile/:username')
    .get(handleGetProfile, requireAuth)
    .post(handleUpdateProfile, requireAuth);