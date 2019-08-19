// App Imports
import params from '../../../setup/config/params'
import { authCheckAdmin } from '../../../setup/helpers/utils'
import { logCreate } from '../../log/mutation'
import User from '../model'

// Get vendors (Admin)
export default async function listVendor({ params: { page = 1 }, auth, translate }) {
  if(authCheckAdmin(auth)) {
    try {
      const limit = params.common.pagination.default
      const skip = (parseInt(page) - 1) * parseInt(limit)

      const query = { role: params.user.roles.vendor.key, isDeleted: false }
      const fields = ['_id', 'email', 'name', 'image', 'mobile', 'isPublished', 'createdAt']

      const list = await User
        .find(query)
        .select(fields)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)

      const count = await User.countDocuments(query)

      return {
        data: {
          list,
          count
        }
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'userListVendor', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
