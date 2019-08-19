// App Imports
import { razorpay } from '../../../setup/server/payment'
import { authCheckAdmin, authCheck } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import Order from '../model'

// Order subscription
export default async function subscription({ params: { orderId }, auth, translate }) {
  if(authCheck(auth) || authCheckAdmin(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: orderId },
        check: 'notEmpty',
        message: translate.t('common.messages.fields.invalid', { data: 'order' })
      },
    ]

    // Validate
    try {
      validate(rules)
    } catch (error) {
      throw new Error(error.message)
    }

    let order = await Order.findById(orderId)

    // Order is recurring (subscription)
    if (order && order.isSubscription) {
      try {
        // Plan
        const plan = await razorpay.plans.create({
          period: 'weekly',
          interval: 1,
          item: {
            name: `PLAN_${auth.user.email}_${order.id}`,
            amount: order.amountTotal * 100,
            currency: 'INR'
          }
        })

        if (plan && plan.id) {
          // Subscription
          const subscription = await razorpay.subscriptions.create({
            plan_id: plan.id,
            customer_notify: 1,
            total_count: 6
          })

          await Order.updateOne(
            //  { _id: orderId, userId: auth.user._id }, //If cancel order needs to be done only by the customer
            { _id: orderId}, //Cancel order can be done by all stakeholders
            { $set: { plan, subscription } }
          )

          order = await Order.findById(order._id)

          return {
            data: order,
            message: translate.t('order.checkout.messages.saved')
          }
        }
      } catch (error) {
        await logCreate({ params: { payload: { method: 'orderSubscription', message: error.message } }, auth })

        throw new Error(translate.t('common.messages.error.server'))
      }
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
