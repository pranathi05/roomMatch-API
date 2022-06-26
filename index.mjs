import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDatabase } from './db/mongoose.mjs';
import { authRoutes } from './routes/auth.mjs';
import { testRoutes } from './routes/test.mjs';
import { userRoutes } from './routes/user.mjs';
import { messageRoutes } from './routes/message.mjs';
import { conversationRoutes } from './routes/conversation.mjs';

config();

const app = express();
app.use(cors());
// const socketio = require("socket.io")
// const io = socketio(server, { wsEngine: "ws" })
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/conversation',conversationRoutes);
app.use('/api/message',messageRoutes);

app.listen(3020, () => {
  console.log('Server started.');
  connectDatabase();
});
