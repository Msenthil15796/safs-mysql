// App Imports
import params from '../../../setup/config/params'
import { authCheckAdmin } from '../../../setup/helpers/utils'
import { logCreate } from '../../log/mutation'
import User from '../model'

// Get customer (Admin)
export default async function listCustomer({ params: { page = 1 }, auth, translate }) {
  if(authCheckAdmin(auth)) {
    try {
      const limit = params.common.pagination.default
      const skip = (parseInt(page) - 1) * parseInt(limit)

      const query = { role: params.user.roles.user.key, isDeleted: false }
      const fields = ['_id', 'communityId', 'email', 'name', 'mobile', 'image', 'dateOfBirth', 'addressWing', 'addressFlat', 'gender', 'createdAt']

      const list = await User
        .find(query)
        .select(fields)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('communityId')

      const count = await User.countDocuments(query)

      return {
        data: {
          list,
          count
        }
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'userListCustomer', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
