import { DataTypes } from 'sequelize';
import { sequelize } from 'server/database/config';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
  },
  mobile_number: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
  google_id: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true, 
});