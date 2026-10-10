import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/sequelize';

class Profile extends Model {
  public id!: number;
  public name!: string;
  public bio!: string;
  public imageUrl!: string;
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,      // ✅ sin UNSIGNED (PostgreSQL no lo soporta)
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'profiles',
  }
);

export default Profile;