// App Imports
import { authCheckAdmin } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import Order from '../model'

// Order deliver toggle
export default async function deliverToggle({ params: { orderId, isDelivered = true }, auth, translate }) {
  if(authCheckAdmin(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: orderId },
        check: 'notEmpty',
        message: translate.t('order.deliver.messages.error')
      }
    ]

    // Validate
    try {
      validate(rules)
    } catch(error) {
      throw new Error(error.message)
    }

    try {
      const data = await Order.updateOne({ _id: orderId }, { $set: { isDelivered: !!isDelivered }})

      return {
        data,
        message: translate.t(`order.deliver.messages.${ isDelivered ? 'delivered' : 'undelivered' }`)
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'orderDeliverToggle', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
