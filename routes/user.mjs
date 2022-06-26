import express from 'express';
import { getUserById, getUserInfo, getUsers, updateUserInfo } from '../controllers/user.mjs';
import { checkAuth } from '../middleware/checkAuth.mjs';
export const userRoutes = express.Router();
userRoutes.get('/', checkAuth, getUserInfo);
userRoutes.patch('/', checkAuth, updateUserInfo);
userRoutes.get('/all', checkAuth, getUsers);
userRoutes.get('/:userId',getUserById);
