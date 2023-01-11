import { DataTypes } from "sequelize";
import db from "../database/db.js";

export const Producto = db.define("productos", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: {
    type: DataTypes.STRING,
  },

  precio: {
    type: DataTypes.DECIMAL(1, 2),
  },

  imagen: {
    type: DataTypes.STRING,
  },
});
