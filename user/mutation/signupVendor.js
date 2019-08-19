// Imports
import bcrypt from 'bcryptjs'
import React from 'react'

// App Imports
import { SECURITY_SALT_ROUNDS } from '../../../setup/config/env'
import params from '../../../setup/config/params'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import User from '../model'

// Signup - Vendor
export default async function userSignupVendor({ params: { name, email, mobile, password }, translate }) {
  // Validation rules
  const rules = [
    {
      data: { value: name, length: params.user.rules.nameMinLength },
      check: 'lengthMin',
      message: translate.t('user.fields.name.messages.lengthMin', { length: params.user.rules.nameMinLength })
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
    {
      data: { value: password, length: params.user.rules.passwordMinLength },
      check: 'lengthMin',
      message: translate.t('user.fields.password.messages.lengthMin', { length: params.user.rules.passwordMinLength })
    }
  ]

  // Validate
  try {
    validate(rules)
  } catch(error) {
    throw new Error(error.message)
  }

  // Check if user exists with same email
  const user = await User.findOne({ email })

  if(!user) {
    try {
      const passwordHashed = await bcrypt.hash(password, SECURITY_SALT_ROUNDS)

      const userData = {
        name,
        email,
        mobile,
        password: passwordHashed,
        role: params.user.roles.vendor.key,
        image: params.user.image.default,
        isPublished: false,
        isDeleted: false
      }
      const user = await User.create(userData)

      if(user) {
        return {
          data: user,
          message: translate.t('user.signupVendor.messages.registered')
        }
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'userSignupVendor', message: error.message } } })

      throw new Error(translate.t('common.messages.error.server'))
    }
  } else {
    throw new Error(translate.t('user.signupVendor.messages.exists'))
  }

  throw new Error(translate.t('common.messages.error.default'))
}
