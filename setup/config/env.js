// Imports
import dotenv from 'dotenv'

// Load .env
dotenv.config()

// Environment
export const NODE_ENV = process.env.NODE_ENV

// Security
export const SECURITY_SECRET = process.env.SECURITY_SECRET
export const SECURITY_SALT_ROUNDS = parseInt(process.env.SECURITY_SALT_ROUNDS)

// Port
export const PORT = process.env.PORT

// Database
export const MONGO_URL = process.env.MONGO_URL

// URL
export const STORE_URL = process.env.STORE_URL
export const ADMIN_URL = process.env.ADMIN_URL
export const API_URL = process.env.API_URL

// Email
export const EMAIL_ON = process.env.EMAIL_ON
export const EMAIL_TEST = process.env.EMAIL_TEST
export const EMAIL_USER = process.env.EMAIL_USER
export const EMAIL_KEY = process.env.EMAIL_KEY

// Payment (Razorpay)
export const PAYMENT_RAZORPAY_ID = process.env.PAYMENT_RAZORPAY_ID
export const PAYMENT_RAZORPAY_SECRET = process.env.PAYMENT_RAZORPAY_SECRET
export const PAYMENT_SIMPL_URL = process.env.PAYMENT_SIMPL_URL
export const PAYMENT_SIMPL_CLIENT_ID = process.env.PAYMENT_SIMPL_CLIENT_ID
export const PAYMENT_SIMPL_CLIENT_SECRET = process.env.PAYMENT_SIMPL_CLIENT_SECRET

// SMS
export const SMS_KEY = process.env.SMS_KEY

// AWS S3
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
export const BUCKET_REGION = process.env.BUCKET_REGION
export const BUCKET = process.env.BUCKET
export const FILE_BASE_URL = process.env.FILE_BASE_URL
