import {DataTypes } from "sequelize"
import db from "../database/db.js"



export const User = db.define('users', {
    
    email:{
        type: DataTypes.STRING,
        unique: true,  
        notEmpty: true,      
    },

    password:{
        type: DataTypes.STRING,
        notEmpty: true,
       
    },
 });

 

 
