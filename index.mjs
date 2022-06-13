import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDatabase } from './db/mongoose.mjs';
import { authRoutes } from './routes/auth.mjs';
import { testRoutes } from './routes/test.mjs';
import { userRoutes } from './routes/user.mjs';
config();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(3020, () => {
  console.log('Server started.');
  connectDatabase();
});
