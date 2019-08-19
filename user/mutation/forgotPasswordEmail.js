// Imports
import React from 'react'

// App Imports
import { randomNumber } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import User from '../model'

// Email
import { send as sendEmail } from '../../email/send'
import ForgotPassword from '../template/ForgotPassword'

// Forgot Password - Email
export default async function forgotPasswordEmail({ params: { email }, translate }) {
  // Validation rules
  const rules = [
    {
      data: { value: email },
      check: 'email',
      message: translate.t('user.fields.email.messages.invalid')
    }
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
    const user = await User.findOne({ email, isDeleted: false })

    if(user) {
      const otp = randomNumber(1000, 9999)

      const update = await User.updateOne({ _id: user._id, isDeleted: false }, { otp })

      await sendEmail({
        translate,
        to: { email },
        subject: translate.t('user.forgotPassword.email.subject', { otp }),
        template: <ForgotPassword otp={otp} />
      })

      return {
        data: update,
        message: translate.t('user.forgotPassword.messages.emailSent', { email })
      }
    } else {
      throw new Error(translate.t('user.forgotPassword.messages.error.invalidUser'))
    }
  } catch (error) {
    await logCreate({ params: { payload: { method: 'userForgotPasswordEmail', message: error.message } } })

    throw new Error(translate.t('common.messages.error.server'))
  }
}
