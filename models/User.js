import Sequelize from "sequelize" 

const {Model, DataTypes} = Sequelize

const User = db.define('user', {
    
    email:{
        type: DataTypes.STRING,
        unique: true,        
    },

    password:{
        type: DataTypes.STRING,
        validate: {
            is: /^[0-9a-f]{64}$/i
          }
    }
 })
 
 export const Usuario = model("usuario", User)