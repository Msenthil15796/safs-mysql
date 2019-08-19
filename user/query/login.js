// Imports
import bcrypt from 'bcryptjs'

// App Imports
import params from '../../../setup/config/params'
//import { razorpay } from '../../../setup/server/payment'
import validate from '../../../setup/helpers/validation'
//import { logCreate } from '../../log/mutation'
import User from '../model'
import authResponse from './authResponse'

// Login
export default async function login({ params: { username, password }, translate }) {
  // Validation rules
  const rules = [
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
  //role for user:role: params.user.roles.user.key
  try {
    // Get user
    const user = await User.findOne({username})

    if(user) {
      const passwordsMatch = await bcrypt.compare(password, user.password)

      if (passwordsMatch) {

        return {
          data: authResponse(user),
          message: translate.t('user.login.messages.success')
        }
      }else{
       return {message:"User does not exist"}
      }
    }
  } catch (error) {
    await logCreate({ params: { payload: { method: 'userLogin', message: error.message } } })

    throw new Error(translate.t('common.messages.error.server'))
  }

  throw new Error(translate.t('user.login.messages.error.wrongCredentials'))
}