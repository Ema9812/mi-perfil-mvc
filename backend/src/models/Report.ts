import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/sequelize';
import Pet from './Pet';

class Report extends Model {
  public id!: number;
  public petId!: number;
  public reporterPhone!: string;
  public location!: string;
  public timestamp!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Report.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    petId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pet,
        key: 'id',
      },
    },
    reporterPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'reports',
  }
);

// Relaciones
Pet.hasMany(Report, { foreignKey: 'petId', as: 'reports' });
Report.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

export default Report;