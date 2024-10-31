import express from 'express';
import { loginUser, registerUser, forgotPassword, resetPassword, adminLogin } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);  // Added forgot password route
userRouter.post("/reset-password", resetPassword);    // Added reset password route
userRouter.post("/admin-login", adminLogin);
export default userRouter;
