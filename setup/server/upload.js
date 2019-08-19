// Imports
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import multer from 'multer'
//import sharp from 'sharp'
import aws from 'aws-sdk'

// App Imports
import params from '../config/params'
import { NODE_ENV,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_KEY,
  BUCKET_REGION,
  BUCKET,
  FILE_BASE_URL
} from '../config/env'

// File upload configurations and route
export default function (server) {
  console.info('SETUP - Upload...')

  const upload = multer({ dest: params.common.folder.uploads }).single('file')

  aws.config.update({
    region: BUCKET_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY
  })
  // Upload route
  server.post(params.endpoint.upload, upload, async (request, response) => {
    // Log info in development mode
    if(NODE_ENV === 'development') {
      console.log(request.body)
    }

    try {
      const readFile = promisify(fs.readFile)
      const unlink = promisify(fs.unlink)
      const s3 = new aws.S3();
      const file = await readFile(request.file.path)

      // File name
      const fileName = request.file.filename + path.extname(request.file.originalname).toLowerCase()
      const resizeFilePath = path.join(__dirname, '..', '..', '..', 'public', params[request.body.type].image.folder, fileName)

      // Resize
      if(params[request.body.type].image.height) {
        // Width + Height
        await sharp(file)
          .resize(params[request.body.type].image.width, params[request.body.type].image.height)
          // .toFile(resizeFilePath)
          .toBuffer( function ( err, data ) {
            s3.putObject( {
              Bucket: BUCKET,
              Key: fileName,
              ACL: 'public-read',
              Body: data
            }, ( err, status ) => {
              if (err) {
                throw err
                return response.json({
                  success: false,
                  file: null
                })
              }
            } );
          } );
      } else {
        // Width
        await sharp(file)
          .resize(params[request.body.type].image.width)
          // .toFile(resizeFilePath)
          .toBuffer( function ( err, data ) {
            s3.putObject( {
              Bucket: "dusminute",
              Key: fileName,
              ACL: 'public-read',
              Body: data
            }, ( err, status ) => {
              if (err) {
                throw err
                return response.json({
                  success: false,
                  file: null
                })
              }
            } );
          } );
      }

      // Remove temporary uploaded image (from `/uploads`)
      await unlink(request.file.path)

      return response.json({
        success: true,
        message: 'File uploaded successfully.',
        file: FILE_BASE_URL+fileName
      })
    } catch (error) {
      response.json({
        success: false,
        file: null
      })
    }
  })
}
