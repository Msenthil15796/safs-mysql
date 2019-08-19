// Imports
//import mongoose, { Schema } from 'mongoose'

// App Imports
//import params from '../../setup/config/params'
//import { collection as Community } from '../community/model'

const Sequelize=require("sequelize")
require('../../setup/server/database')

module.exports=sequelize.define("users",{
  id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    autoIncrement:true,
    primaryKey:true
  },
  firstName:{
    type:Sequelize.STRING,
    allowNull:false
  },
  lastName:{
    type:Sequelize.STRING
  },
  mobile:{
    type:Sequelize.STRING,
    allowNull:false,
    unique:true
  },
  team:{
    type:Sequelize.STRING,
    allowNull:false
  },
  username:{
    type:Sequelize.STRING,
    allowNull:false,

  },
  password:{
    type:Sequelize.STRING,
    allowNull:false
  },
  role:{
    type:Sequelize.STRING,
    allowNull:false
  }

  
}); 
