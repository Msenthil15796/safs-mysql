// Imports
import React from 'react'

// App Imports
import { authCheck } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import authResponse from '../query/authResponse'
import User from '../model'

// Simpl - Set Token
export default async function simplSetToken({ params: { token }, auth, translate }) {
  if(authCheck(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: token },
        check: 'notEmpty',
        message: 'Invalid token'
      }
    ]

    // Validate
    try {
      validate(rules)
    } catch(error) {
      throw new Error(error.message)
    }

    try {

      const user = await User.findOneAndUpdate(
        { _id: auth.user._id },
        {
          $set: {
            simpl: {
              isApproved: true,
              token
            }
          }
        },
        { new: true }
      )

      return {
        data: authResponse(user),
        message: 'Token set successfully.'
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'userSimplSetToken', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
