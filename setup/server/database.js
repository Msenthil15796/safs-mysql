// Imports
//import fs from 'fs'
//import { exec } from 'child_process'
//import mongoose from 'mongoose'
//ateFormat from 'date-fns/format'
const Sequelize =require('sequelize')

const sequelize= new Sequelize("safs-mysql",'senthil','',{
  host:'localhost',
  dialect:'mysql',
  operatorAliases:false,
  logging:false
});




module.exports = sequelize;
global.sequelize = sequelize;

// App Imports
import {NODE_ENV } from '../config/env'

// Backup database
export const backup = function () {
  if(NODE_ENV !== 'development') {
    console.info('JOB - Backup database..')

  //   const BACKUP_PATH = '/user/src/backup/'
  //   const DB_BACKUP_NAME = `DB-${dateFormat(new Date(), 'YYYY-MM-DD-HH-mm-ss')}.gz`

  //  // const cmd = `mongodump -h database --port=27017 -d dusminute  --quiet --gzip --archive=${BACKUP_PATH + DB_BACKUP_NAME}`

    exec(cmd, function (error) {
      console.log(error)
    })
  }
}

// Connect database
export default function () {
  console.info('SETUP - Connecting database..')

  //return mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })

  //mysql connection
  return connection.connect();
}

