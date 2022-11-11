import { DataTypes } from "sequelize";
import db from "../database/db.js";

export const User = db.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
  },

  email: {
    type: DataTypes.STRING,
  },

  password: {
    type: DataTypes.STRING,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },

  otp: {
    type: DataTypes.STRING,
    required: true,
  },

  expiresAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now() + 36000,
  },
});
