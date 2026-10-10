import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './db/sequelize';
import profileRouter from './views/profile';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(profileRouter);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server en http://localhost:${PORT}`);
  });
});