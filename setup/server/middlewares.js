// Imports
import path from 'path'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'

// App Imports
import { NODE_ENV, ADMIN_URL, STORE_URL } from '../config/env'

// Setup middlewares
export default function (server) {
  console.info('SETUP - Middlewares..')

  // Enable CORS
  server.use(cors({
    origin: [ADMIN_URL, STORE_URL]
  }))

  // Request body parser
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: false }))

  // Static files folder
  server.use('/', express.static(path.join(__dirname, '..', '..', '..', 'public')))
  server.use('/reports', express.static(path.join(__dirname, '..', '..', '..', 'reports')))

  // HTTP logger
  if(NODE_ENV === 'development') {
    server.use(morgan('tiny'))
  }
}
