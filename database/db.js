import Sequelize from "sequelize";
//import "../models/User.js";
const db = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  process.env.PASSWORD,

  {
    host: process.env.HOST,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
      },
    },
  }
);

try {
  await db.sync();
  console.log("Conectado a la base de datos exitosamente...!");
} catch (error) {
  console.log("Error al conectarse a la base de dato:", error);
}

export default db;
