// App Imports
import params from '../../../setup/config/params'
import { authCheckAdmin } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import Payment from '../../payment/model'
import Order from '../model'

// Order paid toggle
export default async function paidToggle({ params: { orderId, isPaid = true }, auth, translate }) {
  if(authCheckAdmin(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: orderId },
        check: 'notEmpty',
        message: translate.t('order.paid.messages.error')
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

      const data = await Payment.updateOne({ _id: order.paymentId }, { $set: { status: isPaid ? params.payment.status.done : params.payment.status.pending }})

      return {
        data,
        message: translate.t(`order.paid.messages.${ isPaid ? 'paid' : 'unpaid' }`)
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'orderPaidToggle', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
