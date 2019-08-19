// Imports
import React from 'react'

// App Imports
import { authCheck } from '../../../setup/helpers/utils'
import { logCreate } from '../../log/mutation'
import authResponse from '../query/authResponse'
import User from '../model'

// Change image
export default async function changeImage({ params: { image }, auth, translate }) {
  if (authCheck(auth)) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: auth.user._id },
        { image },
        { new: true }
      )

      return {
        data: authResponse(user),
        message: translate.t('user.profile.messages.success')
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'userChangeImage', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
