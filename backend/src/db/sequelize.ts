import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// En producción (Railway/Render), usamos DATABASE_URL
// En desarrollo local, usamos las variables individuales
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize(
      process.env.DB_NAME || 'pet_finder_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASS || 'password',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
      }
    );

export default sequelize;