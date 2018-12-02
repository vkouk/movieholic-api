import express from "express";
import {
  handleSignIn,
  handleRegister,
  handleGetProfile,
  handleUpdateProfile,
  handleAddUserBalance
} from "../controllers/AuthController";
import requireAuth from "../middlewares/requireAuth";

export const authRouter = express.Router();

authRouter.post("/user/login", handleSignIn);
authRouter.post("/user/register", handleRegister);

authRouter
  .route("/user/profile/:id")
  .get(requireAuth, handleGetProfile)
  .post(requireAuth, handleUpdateProfile);

authRouter.post("/user/addbalance", requireAuth, handleAddUserBalance);
