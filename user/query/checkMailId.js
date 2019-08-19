// Imports
import bcrypt from 'bcryptjs'

// App Imports
import validate from '../../../setup/helpers/validation'
import User, { collection as user } from '../model'
import authResponse from './authResponse'


export default async function checkMailId({ params: { email }, translate }) {
  // Validation rules
  const rules = [
    {
      data: { value: email },
      check: 'email',
      message: translate.t('user.fields.email.messages.invalid')
    }
  ]

  // Validate
  try {
    validate(rules)
  } catch (error) {
    throw new Error(error.message)
  }

  // Check if user exists with same email
  try {
    // Check if user exists
    const user = await User.findOne({ email })

    if (user) {
      return {
        data: authResponse(user),
        message: 'emailId found'
      }
    } else {
      return {
        data: authResponse(user),
        message: 'emailId not found'
      }
    }
  } catch (error) {
    console.log(error)
  }
}