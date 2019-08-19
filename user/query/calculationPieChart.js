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
export default async function calculationPieChart({ params: { startDate, endDate, communityId, paymentType }, auth, translate }) {
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
  } catch (error) {
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

    if (communityId !== 'all') {
      orderQuery['user.community._id'] = ObjectId(communityId)
    }
    if (paymentType !== 'all') {
      orderQuery['payment.type'] = paymentType
    }

    // // Order
    const orders = await Order.aggregate([
      { $group: { _id: "$communityId" , total: { $sum: "$amountTotal" }} },
      { $sort: { createdAt: -1 } }
    ])

    return {
      data: orders
    }

  } catch (error) {
    console.error(error)
  }
}