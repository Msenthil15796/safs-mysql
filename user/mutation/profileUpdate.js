// Imports
import React from 'react'

// App Imports
import params from '../../../setup/config/params'
import { authCheck } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import authResponse from '../query/authResponse'
import User from '../model'

// Update Profile
export default async function profileUpdate({ params: { _id, name, email, mobile, isVerified }, auth, translate }) {
  const set = { _id, name, email, mobile, isVerified }

  // Update
  try {

    const data = await User.updateOne({ _id }, { $set: set })

    return data

  } catch (error) {
    console.log(error)
  }

  if (authCheck(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: name, length: params.user.rules.nameMinLength },
        check: 'lengthMin',
        message: translate.t('user.messages.fields.nameMinLength', { length: params.user.rules.nameMinLength })
      }
    ]

    // Validate
    try {
      validate(rules)
    } catch (error) {
      throw new Error(error.message)
    }

    try {
      const user = await User.findOneAndUpdate(
        { _id: auth.user._id },
        { name },
        { new: true }
      ).populate('communityId')

      return {
        data: authResponse(user),
        message: translate.t('user.profile.messages.success')
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'userProfileUpdate', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
