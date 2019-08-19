// Imports
import React from 'react'

// App Imports
import params from '../../../setup/config/params'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import User from '../model'

// Forgot Password - OTP
export default async function forgotPasswordOtp({ params: { email, otp }, translate }) {
  // Validation rules
  const rules = [
    {
      data: { value: email },
      check: 'email',
      message: translate.t('user.fields.email.messages.invalid')
    },
    {
      data: { value: otp, length: params.user.rules.otpLength },
      check: 'length',
      message: translate.t('user.fields.otp.messages.length', { length: params.user.rules.otpLength })
    },
  ]

  // Validate
  try {
    validate(rules)
  } catch (error) {
    throw new Error(error.message)
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email, otp, isDeleted: false })

    if(user) {
      return {
        data: true,
        message: translate.t('user.forgotPassword.messages.otpVerified')
      }
    } else {
      return {
        success: false,
        message: translate.t('user.forgotPassword.messages.error.invalidOtp')
      }
    }
  } catch (error) {
    await logCreate({ params: { payload: { method: 'userForgotPasswordOtp', message: error.message } } })

    throw new Error(translate.t('common.messages.error.server'))
  }
}
