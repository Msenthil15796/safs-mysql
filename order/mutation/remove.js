// App Imports
import { authCheckAdmin } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import Order from '../model'

// Order Delete
export default async function remove({ params: { orderId }, auth, translate }) {
  if(authCheckAdmin(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: orderId },
        check: 'notEmpty',
        message: translate.t('order.remove.messages.error')
      }
    ]

    // Validate
    try {
      validate(rules)
    } catch(error) {
      throw new Error(error.message)
    }

    try {
      const data = await Order.updateOne({ _id: orderId }, { $set: { isDeleted: true }})

      return {
        data,
        message: translate.t('order.remove.messages.removed')
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'orderRemove', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
