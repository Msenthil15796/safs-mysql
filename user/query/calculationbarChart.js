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
import OrderItem from '../../orderItem/model'
import product from '../../product/model'
import { collection as collectionCommunity, collectionAs as collectionAsCommunity } from '../../community/model'
import { collection as collectionPayment, collectionAs as collectionAsPayment } from '../../payment/model'
import { collection as collectionUser, collectionAs as collectionAsUser } from '../model'

// Report Order Collection
export default async function calculationbarChart({ params: { startDate, endDate, communityId, paymentType }, auth, translate }) {

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
      orderQuery['user.community._id'] =ObjectId(communityId)
    }
    if (paymentType !== 'all') {
      orderQuery['payment.type'] = paymentType
    }

    // Products
    const products = await OrderItem.aggregate([
      { $group: { _id: "$productId", total: { $sum: "$amount" } } },
      { $sort: { createdAt: -1 } }
    ])

    const productsName = await product.distinct("name")

    return {
      data: {
        products,
        productsName
      }
    }

  } catch (error) {
    console.error(error)
  }

}