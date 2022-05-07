import express from 'express';
import { testServer } from '../controllers/test.mjs';
export const testRoutes = express.Router();
testRoutes.get('/', testServer);
