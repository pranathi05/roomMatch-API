import mongoose from 'mongoose';
export const connectDatabase = () =>
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@roommatch-pranathi.cp85u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Database connected.'))
    .catch(() => 'Cannot connect to database.');
    