// Imports
import bcrypt from 'bcryptjs'

// App Imports
import params from '../../../setup/config/params'
import validate from '../../../setup/helpers/validation'
import { logCreate } from '../../log/mutation'
import User, { collection as user } from '../model'
import authResponse from './authResponse'

// Login
export default async function loginAdmin({ params: { email, password }, translate }) {
  // Validation rules
  const rules = [
    {
      data: { value: email },
      check: 'email',
      message: translate.t('user.messages.fields.email')
    },
    {
      data: { value: password, length: params.user.rules.passwordMinLength },
      check: 'lengthMin',
      message: translate.t('user.messages.fields.passwordMinLength', { length: params.user.rules.passwordMinLength })
    }
  ]

  // Validate
  try {
    validate(rules)
  } catch(error) {
    throw new Error(error.message)
  }

  // Check if user exists with same email
  try {
    // Get user
    const user = await User.findOne({ email, $or: [{ role: params.user.roles.admin.key }, { role: params.user.roles.vendor.key } ], isPublished: true, isDeleted: false }).populate('communityId')

    if(user) {
      const passwordsMatch = await bcrypt.compare(password, user.password)

      if (passwordsMatch) {
        return {
          data: authResponse(user),
          message: translate.t('user.login.messages.success')
        }
      }
    }
  } catch (error) {
    await logCreate({ params: { payload: { method: 'userLogin', message: error.message } } })

    throw new Error(translate.t('common.messages.error.server'))
  }

  throw new Error(translate.t('user.login.messages.error.wrongCredentials'))
}