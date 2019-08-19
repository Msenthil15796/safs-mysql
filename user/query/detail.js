// App Imports
import params from '../../../setup/config/params'
import { authCheckAdmin } from '../../../setup/helpers/utils'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import Kyc from '../../kyc/model'
import Wallet from '../../wallet/model'
import balance from '../../wallet/query/balance'
import User from '../model'

// User detail
export default async function detail({ params: { userId }, auth, translate }) {
  if(authCheckAdmin(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: userId },
        check: 'notEmpty',
        message: translate.t('common.messages.fields.invalid', { data: 'user' })
      }
    ]

    // Validate
    try {
      validate(rules)
    } catch (error) {
      throw new Error(error.message)
    }

    try {
      const fields = ['_id', 'communityId', 'email', 'name', 'mobile', 'image', 'dateOfBirth', 'addressWing', 'addressFlat', 'isVerified', 'gender', 'simpl', 'createdAt']

      // User
      const user = await User
        .findById(userId)
        .select(fields)
        .populate('communityId')

      // Wallet
      const wallet = await Wallet
        .find({ userId: user._id, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(params.wallet.summary.limit)
        .populate('paymentId')

      // Wallet balance
      const walletBalance = await balance({ userId: user._id })

      // Kyc
      const kyc = await Kyc.find({ userId: user._id, isDeleted: false })

      return {
        data: {
          user,
          wallet,
          walletBalance,
          kyc
        }
      }
    } catch (error) {
      await logCreate({ params: { payload: { method: 'userDetail', message: error.message } }, auth })

      throw new Error(translate.t('common.messages.error.server'))
    }
  }

  throw new Error(translate.t('common.messages.error.unauthorized'))
}
