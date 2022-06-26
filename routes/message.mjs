import express from 'express';
import { getMessage, postMessage } from '../controllers/message.mjs';
export const messageRoutes = express.Router();

messageRoutes.get('/:conversationId',getMessage);
messageRoutes.post('/',postMessage);