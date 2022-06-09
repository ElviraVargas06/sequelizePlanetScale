import Sequelize from "sequelize" 

const db = new Sequelize( process.env.DATABASE, 
                          process.env.USER, 
                          process.env.PASSWORD,{
                    host: process.env.HOST,
                    dialect: 'mysql'
                  })

try{
    await db.authenticate()
    console.log("Conectado a la base de datos exitosamente...!")
  }catch(error){
    console.log("Error al conectarsea la base de dato:", error)
  }
  
  export default db