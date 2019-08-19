// App Imports
import params from '../../../setup/config/params'
import { authCheckAdmin, authCheckVendor } from '../../../setup/helpers/utils'
import { logCreate } from '../../log/mutation'
import Category from '../../category/model'
import Product from '../../product/model'
import Order from '../../order/model'
import User from '../model'

// Dashboard counts (Admin/Vendor)
export default async function dashboardCounts({ auth, translate }) {
  if(authCheckVendor(auth) || authCheckAdmin(auth)) {
    try {
      if(authCheckAdmin(auth)) {
        // Admin
        const category = await Category.countDocuments({ isPublished: true, isDeleted: false })
        const product = await Product.countDocuments({ isPublished: true, isDeleted: false })
        const order = await Order.countDocuments({ isPublished: true, isDeleted: false })
        const vendor = await User.countDocuments({ role: params.user.roles.vendor.key, isPublished: true, isDeleted: false })
        const customer = await User.countDocuments({ role: params.user.roles.user.key, isPublished: true, isDeleted: false })

        return {
          data: {
            category,
            product,
            order,
            vendor,
            customer
          }
        }
      } else if(authCheckVendor(auth)) {
        // Vendor
        const product = await Product.countDocuments({ vendorId: auth.user._id, isPublished: true, isDeleted: false })
        const order = await Order.countDocuments({ isPublished: true, isDeleted: false }) // @todo fetch only vendor orders count

        return {
          data: {
            product,
            order
          }
        }
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'userDashboardCounts', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
