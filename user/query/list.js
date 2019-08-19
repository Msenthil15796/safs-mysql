// App Imports
import params from '../../../setup/config/params'
import { authCheckAdmin } from '../../../setup/helpers/utils'
import { logCreate } from '../../log/mutation'
import User from '../model'

// Get all (Admin)
export default async function list({ auth, translate }) {
  if(authCheckAdmin(auth)) {
    try {
      const fields = ['_id', 'email', 'name', 'createdAt']

      const data = await User
        .find({ role: { $ne: params.user.roles.admin.key }, isDeleted: false })
        .select(fields)
        .sort({ createdAt: -1 })

      return {
        data
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'userList', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
