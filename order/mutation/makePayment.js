// App Imports
import params from '../../../setup/config/params'
import { razorpay } from '../../../setup/server/payment'
import { authCheck } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import Payment from '../../payment/model'
import Order from '../model'
import Wallet from '../../wallet/model'

// Order make payment
export default async function makePayment({ params: { orderId, paymentType, onlinePaymentId }, auth, translate }) {
  if(authCheck(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: orderId },
        check: 'notEmpty',
        message: translate.t('common.messages.fields.invalid', { data: 'order' })
      },
      {
        data: { value: paymentType },
        check: 'notEmpty',
        message: translate.t('common.messages.fields.invalid', { data: 'payment type' })
      },
    ]

    // Validate
    try {
      validate(rules)
    } catch(error) {
      throw new Error(error.message)
    }

    try {
      const order = await Order.findById(orderId)

      let gatewayResponse = {}
      let status = params.payment.status.pending

      if(paymentType === params.payment.types.online && onlinePaymentId) {
        // Gateway - Fetch payment info
        const response = await razorpay.payments.fetch(onlinePaymentId)

        if(response) {
          gatewayResponse = response
          if(
            (response.status === params.payment.gateway.status.done) &&
            (response.amount === (order.amountTotal * 100))
          ) {
            status = params.payment.status.done
          }
        }
      } else if (paymentType === params.payment.types.wallet && onlinePaymentId) {
        // Gateway - Capture payment
        const response = await razorpay.payments.capture(onlinePaymentId, order.amountTotal * 100)

        if(response) {
          gatewayResponse = response

          status = params.payment.status.done
        }
      }

      const payment = await Payment.create({
        userId: auth.user._id,
        amount: order.amountTotal,
        type: params.payment.types[paymentType],
        status,
        gatewayResponse,
        note: `Make payment for order #${ order.id }`
      })

      if(payment) {
        if(paymentType === params.payment.types.wallet) {
          // Wallet
          await Wallet.create({
            userId: auth.user._id,
            paymentId: payment._id,
            amount: -order.amountTotal,
            transaction: params.wallet.transaction.debit,
            isDeleted: false
          })
        }

        // Publish order
        const data = await Order.updateOne(
          { _id: orderId, userId: auth.user._id },
          { $set: { paymentId: payment._id, isPublished: true } }
        )

        return {
          data,
          message: translate.t(`order.checkout.messages.placed`)
        }
      } else {
        return {
          success: false,
          message: translate.t(`order.checkout.messages.paymentFailed`)
        }
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'orderMakePayment', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
