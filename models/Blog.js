import {DataTypes } from "sequelize"
import db from "../database/db.js"
 
export const Blog = db.define('blogs', {
    
   titulo:{
       type: DataTypes.STRING
   },

   contenido:{
    type: DataTypes.STRING
   }
})


