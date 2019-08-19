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
import Order from '../../order/model'
import { collection as collectionCommunity, collectionAs as collectionAsCommunity } from '../../community/model'
import { collection as collectionPayment, collectionAs as collectionAsPayment } from '../../payment/model'
import { collection as collectionUser, collectionAs as collectionAsUser } from '../model'

// Report Order Collection
export default async function reportOrderCollection({ params: { startDate, endDate, communityId, paymentType }, auth, translate }) {
  if(authCheckAdmin(auth) || authCheckFinance(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: startDate },
        check: 'notEmpty',
        message: translate.t('common.messages.fields.invalid', { data: 'start date' })
      },
      {
        data: { value: endDate },
        check: 'notEmpty',
        message: translate.t('common.messages.fields.invalid', { data: 'end date' })
      },
      {
        data: { value: communityId },
        check: 'notEmpty',
        message: translate.t('common.messages.fields.invalid', { data: 'community' })
      },
      {
        data: { value: paymentType },
        check: 'notEmpty',
        message: translate.t('common.messages.fields.invalid', { data: 'payment type' })
      }
    ]

    // Validate
    try {
      validate(rules)
    } catch(error) {
      throw new Error(error.message)
    }

    try {
      // Orders
      const orderQuery = {
        createdAt: {
          $gte: dateStartOfDay(dateParse(startDate)),
          $lte: dateEndOfDay(dateParse(endDate))
        },
        isPublished: true,
        isDeleted: false
      }

      if(communityId !== 'all') {
        orderQuery['user.community._id'] =ObjectId(communityId)
      }
      if(paymentType !== 'all') {
        orderQuery['payment.type'] = paymentType
      }

      // Order
      const orders = await Order.aggregate([
        {
          // Order / User
          $lookup: {
            from: collectionUser,
            let: { userId: "$userId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },

              // Order / User / Community
              {
                $lookup: {
                  from: collectionCommunity,
                  let: { communityId: '$communityId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$communityId'] } } },
                  ],
                  as: collectionAsCommunity
                },
              },

              { $unwind: `$${ collectionAsCommunity }` }
            ],
            as: collectionAsUser,
          },
        },

        { $unwind: `$${ collectionAsUser }` },

        {
          // Order / Payment
          $lookup: {
            from: collectionPayment,
            let: { paymentId: "$paymentId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$paymentId"] } } },
            ],
            as: collectionAsPayment,
          }
        },

        { $unwind: `$${ collectionAsPayment }` },

        // Where
        { $match: orderQuery },

        // Sort
        { $sort: { createdAt: -1 } }
      ])

      if(orders.length > 0) {
        const writeFile = promisify(fs.writeFile)
        const stringify = promisify(csvStringify)

        let data = []

        for (let order of orders) {
          data.push({
            Order: order.id,
            Community: order.user.community.name,
            Date: dateFormat(order.createdAt, params.common.date.format.full),
            Type: params.order.types[order.type].title,
            Payment: order.payment.type,
            Amount: order.amountTotal,
          })
        }

        const fileContent = await stringify(data, { header: true })

        const fileName = 'Order-Collection-' + dateFormat(new Date(), 'YYYY-MM-DD-HH-mm') + '.csv'

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
