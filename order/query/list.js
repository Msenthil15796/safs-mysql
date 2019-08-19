// App Imports
import params from '../../../setup/config/params'
import { authCheckAdmin, authCheckVendor } from '../../../setup/helpers/utils'
import { logCreate } from '../../log/mutation'
import Order from '../model'

// Order get all (Admin/Vendor)
export default async function list({ params: { page = 1}, auth, translate }) {

  // For Vendor
  if(authCheckVendor(auth)) {
    try {
      const limit = params.common.pagination.default
      const skip = (parseInt(page) - 1) * parseInt(limit)

      const userId = auth.user._id

      const vendorData = await Order
        .aggregate([
          {
            $lookup: {
              from: "OrderItem",
              localField: "_id",
              foreignField: "orderId",
              as: "OrderItem"
            }
          }
        ])
        .skip(skip)
        .sort({ createdAt: -1 })
        .limit(limit)
      
      let populateData = await Order.populate(vendorData, [
        'paymentId',
        { path: 'userId', populate: { path: 'communityId' } }
      ])

      const list = populateData.filter(obj => {
        if (obj.OrderItem.filter(obj => obj.vendorId && obj.vendorId.equals(userId)).length > 0) {
          var orderData = obj.OrderItem.filter(obj => obj.vendorId.equals(userId))
          obj.OrderItem = orderData
          return orderData
        }
      })

      const count = list.length

      return {
        data: {
          list,
          count
        }
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'orderList', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }

  // For Admin
  } if (authCheckAdmin(auth)) {
    try {
      const limit = params.common.pagination.default
      const skip = (parseInt(page) - 1) * parseInt(limit)
      const query = { isPublished: true, isDeleted: false }

      const list = await Order
        .find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate([
          'paymentId',
          { path: 'userId', populate: { path: 'communityId' } }
        ])

      const count = await Order.countDocuments(query)

      return {
        data: {
          list,
          count
        }
      }

    } catch (error) {
      await logCreate({ params: { payload: { method: 'orderList', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
