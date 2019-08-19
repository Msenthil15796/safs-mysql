// Imports
import React from 'react'

// App Imports
import { razorpay } from '../../../setup/server/payment'
import { logCreate } from '../../log/mutation'
import User from '../model'

// Register customer in Razorpay
export default async function registerCustomer({ user }) {
  try {
    if(user && !user.customer) {
      // Register customer in Razorpay
      const customer = await razorpay.customers.create({
        name: user.name,
        email: user.email,
        contact: user.mobile,
        notes: { _id: user._id.toString() }
      })

      // Save customer info in user
      if (customer) {
        await User.updateOne({ _id: user._id }, { $set: { customer } })
      }

      return customer
    }
  } catch (error) {
    console.error(error)
    await logCreate({ params: { payload: { method: 'userRegisterCustomer', message: error.message || error.error } } })
    throw error
  }
}
