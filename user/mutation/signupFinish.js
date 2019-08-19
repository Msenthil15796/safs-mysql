// Imports
import React from 'react'

// App Imports
import params from '../../../setup/config/params'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import authResponse from '../query/authResponse'
import User from '../model'

// Email
import { send as sendEmail } from '../../email/send'
import Signup from '../template/Signup'

// Signup finish - Customer
export default async function signup({ params: { email, mobile, otp }, translate }) {
  // Validation rules
  const rules = [
    {
      data: { value: otp },
      check: 'notEmpty',
      message: translate.t('common.messages.fields.invalidSelection', { data: 'otp' })
    },
    {
      data: { value: email },
      check: 'email',
      message: translate.t('user.fields.email.messages.invalid')
    },
    {
      data: { value: mobile },
      check: 'notEmpty',
      message: translate.t('common.messages.fields.invalid', { data: 'mobile' })
    },
  ]

  // Validate
  try {
    validate(rules)
  } catch(error) {
    throw new Error(error.message)
  }

  // Check if user exists with same email
  const user = await User.findOne({ email, mobile, isVerified: false })

  if(user) {
    if(user.otp === otp) {
      try {
        const finished = await User.updateOne({ _id: user._id }, { isVerified: true, isPublished: true, otp: '' })

        if (finished) {
          // Register customer in Razorpay
          await this.userRegisterCustomer({ user })

          // Send email
          await sendEmail({
            translate,
            to: {
              email: user.email
            },
            from: {
              name: params.site.emails.support.name,
              email: params.site.emails.support.email
            },
            subject: translate.t('user.signup.email.subject'),
            template: <Signup
              to={user.name}
              translate={translate}
            />
          })

          const userNew = await User.findOne({ _id: user._id }).populate('communityId')

          return {
            data: authResponse(userNew),
            message: translate.t('user.signup.messages.registered')
          }
        }
      } catch (error) {
        await logCreate({ params: { payload: { method: 'userSignupFinish', message: error.message } } })

        throw new Error(translate.t('common.messages.error.server'))
      }
    } else {
      throw new Error(translate.t('user.signup.messages.errorOtp'))
    }
  }

  throw new Error(translate.t('common.messages.error.default'))
}
