// Imports
import React from 'react'

// App Imports
import { authCheckAdmin, authCheckVendor } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import User from '../model'

// Publish toggle - Vendor
export default async function publishToggleVendor({ params: { vendorId, isPublished = true }, auth, translate }) {
  if(authCheckVendor(auth) || authCheckAdmin(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: vendorId },
        check: 'notEmpty',
        message: translate.t('user.publish.messages.error', { user: 'vendor'})
      }
    ]

    // Validate
    try {
      validate(rules)
    } catch(error) {
      throw new Error(error.message)
    }

    try {
      const data = await User.updateOne({ _id: vendorId }, { $set: { isPublished: !!isPublished }})

      return {
        data,
        message: translate.t(`user.publish.messages.${ isPublished ? 'published' : 'unpublished' }`, { user: 'Vendor'})
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'userPublishToggleVendor', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
