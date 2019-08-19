// App Imports
import axios from 'axios'

// App Imports
import { PAYMENT_SIMPL_URL, PAYMENT_SIMPL_CLIENT_SECRET } from '../../../setup/config/env'
import { authCheck } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import Payment from '../../payment/model'
import OrderItem from '../../orderItem/model'
import Order from '../model'
import params from '../../../setup/config/params'

// Order Simpl Pay
export default async function simplPay({ params: { orderId, fingerprint }, auth, translate }) {
  if(authCheck(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: orderId },
        check: 'notEmpty',
        message: translate.t('common.messages.fields.invalid', { data: 'order' })
      },
      {
        data: { value: fingerprint },
        check: 'notEmpty',
        message: 'Your Simpl account is invalid.'
      },
    ]

    // Validate
    try {
      validate(rules)
    } catch (error) {
      throw new Error(error.message)
    }

    try {
      // Order
      let order = await Order.findById(orderId)

      if(order) {
        // Eligibility check
        const { data } = await axios({
          method: 'post',
          url: `${ PAYMENT_SIMPL_URL }/transactions/check_eligibility`,
          headers: { authorization: PAYMENT_SIMPL_CLIENT_SECRET },
          data: {
            zero_click_token: auth.user.simpl.token,
            amount_in_paise: order.amountTotal * 100,
          }
        })

        if(data && data.success && data.data && data.data.eligibility_status) {
          // Order items
          let orderItems = await OrderItem.find({ orderId })
          let items = []
          orderItems.map(item => {
            items.push({
              sku: item._id,
              quantity: item.quantity,
              rate_per_item: item.amount * 100
            })
          })

          const address = {
            line1: '811, Crescent Business Park',
            line2: 'Near Telephone exchange',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India'
          }

          // Charge user via Simpl
          const { data } = await axios({
            method: 'post',
            url: `${ PAYMENT_SIMPL_URL }/transactions`,
            headers: { authorization: PAYMENT_SIMPL_CLIENT_SECRET },
            data: {
              zero_click_token: auth.user.simpl.token,
              amount_in_paise: order.amountTotal * 100,
              order_id: order._id,
              items,
              shipping_address: address,
              billing_address: address,
              customer_id: auth.user._id,
              email: auth.user.email,
            }
          })

          if (data && data.success && data.data && data.data.transaction && data.data.transaction.id) {
            const payment = await Payment.create({
              userId: auth.user._id,
              amount: order.amountTotal,
              type: params.payment.types.simpl,
              status: params.payment.status.done,
              gatewayResponse: data.data,
              note: `Make payment via Simpl for order #${ order.id }`
            })

            // Publish order
            const orderUpdated = await Order.updateOne(
              { _id: order._id, userId: auth.user._id },
              { $set: { paymentId: payment._id, isPublished: true } }
            )

            return {
              data: orderUpdated,
              message: translate.t('order.checkout.messages.saved')
            }
          }
        }

        return {
          success: false,
          message: 'You are not eligible to pay this amount via Simpl. Please choose other payment option.'
        }
      }
    } catch (error) {
      console.log(error)
      await logCreate({ params: { payload: { method: 'orderSimplPay', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
