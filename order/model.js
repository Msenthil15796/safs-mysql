// // Imports


const Sequelize=require("sequelize")
require('../../setup/server/database')


module.exports = sequelize.define("contacts", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    //autoIncrement: true,
    primaryKey: true
  },
  userId:{
      type:Sequelize.INTEGER,
      allowNull:false
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  village: {
    type: Sequelize.STRING,
    allowNull: false
  },
  district: {
    type: Sequelize.STRING,
    allowNull: false
  },
  contactNo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  crop: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fieldSize: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  latlang: {
    type: Sequelize.INTEGER
  },
  nextDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  reason: {
    type: Sequelize.STRING,
    allowNull: false
  },
  remarks: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
// //import mongoose, { Schema } from 'mongoose'

// // App Imports
// import { collection as User } from '../user/model'
// import {collection as Visitlog} from '../orderItem/model'


// // Collection name
// export const collection = 'Contact'
// export const collectionAs = 'contacts'

// // Schema


// const visitLogDtoschema=new Schema({
//   Visitlog:{
//   type:[
//       {
//         contactId:{
//           type:Number,
//          allowNull:false,
//           ref:Visitlog
//         },
//         nextDate:{
//           type:String,
//           required:true,
//           ref:Visitlog
//         },
//         remarks:{
//           type:String,
//           required:true,
//           ref:Visitlog
//         },
//         status:{
//           type:String,
//           required:true,
//           ref:Visitlog
//         },
//         reason:{
//           type:String,
//           required:true,
//           ref:Visitlog
//         }
//       }
//     ]
//   }

// })
// const schema = new Schema({
//   userId: {
//     type: Schema.Types.ObjectId,
//     required: true,
//     ref: User,
//     index: true
//   },

//   contactId: {
//     type:Number,
//     required: true,
//     unique:true,
//     index: true
//   },
//   name:{
//     type:String,
//     required:true
//   },
//   village:{
//     type:String,
//     required:true
//   },
//   district:{
//     type:String,
//     required:true
//   },
//   contactNo:{
//     type:String,
//     required:true
//   },
//   type:{
//     type:String,
//     required:true
//   },
//   date:{
//     type:Date,
//     required:true
//   },
//   crop:{
//     type:String,
//     required:true
//   },
//   fieldSize:{
//     type:Number,
//      required:true
//   },
//   latlang:{
//     type:Number
//   },
//   nextDate:{
//     type:Date,
//     required:true
//   },
//   reason:{
//     type:String,
//     required:true
//   },
//   remarks:{
//     type:String,
//     required:true
//   },
//   status:{
//     type:String,
//     required:true
//   },
//   visitLogDto:{visitLogDtoschema}




 
  
// }, { timestamps: true })

// Model
// //export default mongoose.model(collection, schema, collection)
