import express from 'express';
import { getConversation, postConversation } from '../controllers/conversation.mjs';
export const conversationRoutes = express.Router();

conversationRoutes.get('/:userId',getConversation)
conversationRoutes.post('/', postConversation);