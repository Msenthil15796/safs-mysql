// Imports
import bcrypt from 'bcryptjs'
import React from 'react'

// App Imports
import { SECURITY_SALT_ROUNDS } from '../../../setup/config/env'
import params from '../../../setup/config/params'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import User from '../model'

// Forgot Password - Reset
export default async function forgotPasswordReset({ params: { email, otp, password }, translate }) {
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
    {
      data: { value: password, length: params.user.rules.passwordMinLength },
      check: 'lengthMin',
      message: translate.t('user.fields.password.messages.lengthMin', { length: params.user.rules.passwordMinLength })
    },
  ]

  // Validate
  try {
    validate(rules)
  } catch (error) {
    throw new Error(error.message)
  }

  // Check if user exists with same email
  try {
    // Check if user exists
    const user = await User.findOne({ email, otp })

    if(user) {
      const passwordNew = await bcrypt.hash(password, SECURITY_SALT_ROUNDS)

      const update = await User.updateOne({ _id: user._id, isDeleted: false }, { password: passwordNew })

      return {
        data: update,
        message: translate.t('user.forgotPassword.messages.resetDone')
      }
    } else {
      return {
        success: false,
        message: translate.t('user.forgotPassword.messages.error.invalidInfo')
      }
    }
  } catch (error) {
    await logCreate({ params: { payload: { method: 'userForgotPasswordReset', message: error.message } } })

    throw new Error(translate.t('common.messages.error.server'))
  }
}
