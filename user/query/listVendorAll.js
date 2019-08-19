// App Imports
import params from '../../../setup/config/params'
import { authCheckAdmin } from '../../../setup/helpers/utils'
import { logCreate } from '../../log/mutation'
import User from '../model'

// Get vendors all (Admin)
export default async function listVendorAll({ auth, translate }) {
  if(authCheckAdmin(auth)) {
    try {
      const fields = ['_id', 'email', 'name']

      const data = await User
        .find({ role: params.user.roles.vendor.key, isPublished: true, isDeleted: false })
        .select(fields)
        .sort({ name: 1 })

      return {
        data
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'userListVendorAll', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
