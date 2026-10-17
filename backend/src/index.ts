import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './db/sequelize';
import './models';
import authRouter from './views/auth';
import petRouter from './views/pet';
import reportRouter from './views/report';
import { indexAllPets } from './services/algolia';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(authRouter);
app.use(petRouter);
app.use(reportRouter);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(async () => {
  // Indexar todas las mascotas al iniciar
  await indexAllPets();

  app.listen(PORT, () => {
    console.log(`🚀 Server en http://localhost:${PORT}`);
  });
});