// Imports
import Razorpay from 'razorpay'

// App Imports
import { PAYMENT_RAZORPAY_ID, PAYMENT_RAZORPAY_SECRET } from '../config/env'

// Razorpay
export const razorpay = new Razorpay({
  key_id: PAYMENT_RAZORPAY_ID,
  key_secret: PAYMENT_RAZORPAY_SECRET
})
