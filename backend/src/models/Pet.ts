import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/sequelize';
import User from './User';

class Pet extends Model {
  public id!: number;
  public name!: string;
  public status!: 'lost' | 'found';
  public location!: string;
  public lat?: number;
  public lng?: number;
  public imageUrl?: string;
  public reporterId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('lost', 'found'),
      allowNull: false,
      defaultValue: 'lost',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'pets',
  }
);

// Relación: un User tiene muchas Pets
User.hasMany(Pet, { foreignKey: 'reporterId', as: 'pets' });
Pet.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });

export default Pet;