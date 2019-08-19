// App Imports
import params from '../../../setup/config/params'
import { authCheck } from '../../../setup/helpers/utils'
import { authCheckAdmin, authCheckVendor } from '../../../setup/helpers/utils'
import { logCreate } from '../../log/mutation'
import OrderItemDelivery from '../../orderItemDelivery/model'
import OrderItem from '../../orderItem/model'
import Order from '../model'

// Order get detail by id (Admin/Vendor)
export default async function detail({ params: { orderId }, auth, translate }) {
  if (authCheck(auth)) {
    try {
      const query = { _id: orderId, isDeleted: false }

      if(params.user.roles.user.key === auth.user.role) {
        query.userId = auth.user._id
      }

      const authId = auth.user._id
      
      const order = await Order
      .findOne(query)
      .populate([
        { path: 'userId', populate: ['communityId'] },
        'paymentId'
      ])
      
      
      if(order) {
        const orderItems = await OrderItem
        .find({ orderId: order._id })
        .populate({
          path: 'productId',
          populate: [
            { path: 'categoryId' },
            { path: 'vendorId' }
          ]
        })

        // For Vendor
        if (authCheckVendor(auth)) {
          var vendorOrderItems = orderItems.filter(obj => obj.vendorId.equals(authId))
        }

        const orderItemDelivery = await OrderItemDelivery
          .find({ orderId: order._id, orderItemId: orderItems[0]._id })

        return {
          data: {
            order,
            orderItems: authCheckVendor(auth) ? vendorOrderItems : orderItems,
            orderItemDelivery
          }
        }
      } else {
        throw new Error('Invalid order')
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'orderDetail', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
