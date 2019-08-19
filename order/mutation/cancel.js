// App Imports
import params from '../../../setup/config/params'
import { razorpay } from '../../../setup/server/payment'
import { authCheckAdmin,authCheck } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import Order from '../model'

// Order orderCancel
export default async function cancel({ params: { orderId }, auth, translate }) {
  if(authCheck(auth) || authCheckAdmin(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: orderId },
        check: 'notEmpty',
        message: translate.t('order.cancel.messages.error')
      }
    ]

    // Validate
    try {
      validate(rules)
    } catch(error) {
      throw new Error(error.message)
    }

    try {
      const order = await Order.findById(orderId)

      if(order) {
        const data = await Order.updateOne(
        //  { _id: orderId, userId: auth.user._id }, //If cancel order needs to be done only by the customer
          { _id: orderId}, //Cancel order can be done by all stakeholders
          { $set: { isCancelled: true, cancelledAt: new Date() } }
        )

        // RazorPay subscription cancel
        if(order.type === params.order.types.subscription.key && order.paymentType === params.order.paymentTypes.online.key) {
          const response = await razorpay.subscriptions.cancel(order.subscription.id)

          if(response) {
            return {
              data,
              message: translate.t('order.cancel.messages.cancelled')
            }
          }
        } else {
          return {
            data,
            message: translate.t('order.cancel.messages.cancelled')
          }
        }
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'orderCancel', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
