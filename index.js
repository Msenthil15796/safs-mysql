// Imports
import express from 'express'

// App Imports
// import database from './setup/server/database'
//import jobs from './setup/server/jobs'
import middlewares from './setup/server/middlewares'
// import upload from './setup/server/upload'
// import multipleUpload from './setup/server/multipleUpload'
import endpoint from './setup/server/endpoint'
import start from './setup/server/start'

// Create express server
const server = express()

// Connect database
//database()

// Schedule jobs
//jobs()

// Setup middlewares
middlewares(server)

// Setup uploads
//upload(server)

// Setup multipleUpload
//(server)

// Setup endpoint
endpoint(server)

// Start server
start(server)
