import express from 'express';
import {
  isAuthorized,
  registerUser,
  sendOTP,
  userLogin,
  verifyOTP,
} from '../controllers/auth.mjs';
export const authRoutes = express.Router();
authRoutes.post('/otp/send', sendOTP);
authRoutes.post('/otp/verify', verifyOTP);
authRoutes.post('/register', registerUser);
authRoutes.post('/login', userLogin);
authRoutes.get("/login", ()=>{console.log(1)})
authRoutes.get('/authorized', isAuthorized);
