// Imports
import dateParse from 'date-fns/parse'

// App Imports
import params from '../../../setup/config/params'
import { authCheck, randomString } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import Product from '../../product/model'
import OrderItemDelivery from '../../orderItemDelivery/model'
import OrderItem from '../../orderItem/model'
import Order from '../model'

// Order checkout
export default async function checkout({ params: { cart }, auth, translate }) {
  if (authCheck(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: cart },
        check: 'notEmpty',
        message: translate.t('common.messages.fields.invalid', { data: 'cart' })
      }
    ]

    // Validate
    try {
      validate(rules)
    } catch (error) {
      throw new Error(error.message)
    }

    // Create
    try {
      let amount = 0
      let itemsCount = 0

      // Calculate total amount
      const items = Object.values(cart.items)      
      let productCount = 0;
      switch (params.order.types[cart.orderType].key) {
        // Subscription
        case params.order.types.subscription.key:
          for (let item of items) {
            let productActual = await Product.findById(item.product._id)

            if (productActual) {
              itemsCount += item.count          
              productCount++;
              if (item.frequency === params.order.frequency.daily) {
                amount += (productActual.priceDiscounted || productActual.price) * productCount * 7
              } else if (item.frequency === params.order.frequency.days) {
                amount += (productActual.priceDiscounted || productActual.price) * productCount * item.frequencyDays.length
              }
            }
          }
          break

        // Prepaid subscription
        case params.order.types.prepaidSubscription.key:
          
          for (let item of items) {
            amount += cart.amountTotal
          }
          break

        // One time
        case params.order.types.oneTime.key:
            
          for (let item of items) {
            let productActual = await Product.findById(item.product._id)

            if (productActual) {
              productCount++ ; 
              itemsCount += item.count
              amount += cart.amountTotal
            }
          }
          break
      }

      // Amount and discount
      amount = Number(amount).toFixed(2)
      const discount = 0
      const amountTotal = (discount > 0) ? ((amount - (amount * (discount / 100))).toFixed(2)) : amount
      
      // Create Order
      const set = {
        id: randomString(8).toUpperCase(),
        userId: auth.user._id,
        communityId: auth.user.communityId,
        type: params.order.types[cart.orderType].key,
        amount,
        discount,
        amountTotal,
        itemsCount,
      }

      // Create order
      let order = await Order.create({ ...set, isDelivered: false, isPublished: false, isDeleted: false }) // Create

      if (order) {
        let productCountforOrderItem = 0;
        for (let item of items) {
          productCountforOrderItem++
          let productActual = await Product.findById(item.product._id)
          // Create order items
          const orderItem = await OrderItem.create({
            orderId: order._id,
            productId: item.product._id,
            amount: productActual.price * productCountforOrderItem,
            quantity: item.count,
            frequency: item.frequency,
            frequencyDays: item.frequencyDays,
            vendorId: item.product.vendorId
          })

          // Prepaid subscription
          if (order.type === params.order.types.prepaidSubscription.key) {
            for (let date of cart.deliveryDates) {
              // Create order item delivery
              await OrderItemDelivery.create({
                orderId: order._id,
                orderItemId: orderItem._id,
                date: dateParse(date)
              })
            }
          }

          // Increment product buy count
          await Product.updateOne({ _id: item.product._id }, { $inc: { buyCount: 1 } })
        }
      }

      return {
        data: order,
        message: translate.t('order.checkout.messages.saved')
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'orderCheckout', message: error.message } }, auth })
      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
