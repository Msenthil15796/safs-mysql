// Imports
import fs from 'fs'
import path from 'path'
//import mongoose from 'mongoose'
import { promisify } from 'util'
import csvStringify from 'csv-stringify'
import dateFormat from 'date-fns/format'
import dateParse from 'date-fns/parse'
import dateStartOfDay from 'date-fns/start_of_day'
import dateEndOfDay from 'date-fns/end_of_day'

// App Imports
import { API_URL } from '../../../setup/config/env'
import params from '../../../setup/config/params'
import { authCheckAdmin, authCheckFinance } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import OrderItemDelivery from '../../orderItemDelivery/model'
import OrderItem from '../../orderItem/model'
import Order from '../../order/model'

// Report Order Collection
export default async function reportOrderPrepaidDeliveriesToday({ params: { communityId }, auth, translate }) {
  if(authCheckAdmin(auth) || authCheckFinance(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: communityId },
        check: 'notEmpty',
        message: translate.t('common.messages.fields.invalid', { data: 'community' })
      },
    ]

    // Validate
    try {
      validate(rules)
    } catch(error) {
      throw new Error(error.message)
    }

    try {
      // Orders
      const orderItemsDelivery = await OrderItemDelivery
        .find({ date: { $gte: dateStartOfDay(new Date()), $lte: dateEndOfDay(new Date()) } })
        .populate([
          {
            path: 'orderId',
            populate: [
              { path: 'userId' },
              { path: 'communityId' }
            ]
          },
          {
            path: 'orderItemId',
            populate: [
              { path: 'productId' },
            ]
          }
        ])

      if(orderItemsDelivery.length > 0) {
        const writeFile = promisify(fs.writeFile)
        const stringify = promisify(csvStringify)

        let data = []

        for (let item of orderItemsDelivery) {
          data.push({
            Order: item.orderId.id,
            Community: item.orderId.communityId.name,
            Address: item.orderId.userId.addressWing ? `${ item.orderId.userId.addressWing } - ${ item.orderId.userId.addressFlat }` : '',
            Customer: item.orderId.userId.name,
            Mobile: item.orderId.userId.mobile,
            Date: dateFormat(item.date, params.common.date.format.date),
            Product: item.orderItemId.productId.name,
            Quantity: item.orderItemId.quantity,
          })
        }

        const fileContent = await stringify(data, { header: true })

        const fileName = 'Order-Deliveries-' + dateFormat(new Date(), 'YYYY-MM-DD') + '.csv'

        await writeFile(path.join(__dirname, '..', '..', '..', '..', 'reports', fileName), fileContent)

        return {
          data: `${API_URL}/reports/${fileName}`,
          message: 'Report generated successfully.'
        }
      } else {
        return {
          success: false,
          message: 'No data was found for the report.'
        }
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'userReportOrderCollection', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
