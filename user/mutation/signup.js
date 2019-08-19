// Imports
import bcrypt from 'bcryptjs'
// import axios from 'axios'
// import React from 'react'

// App Imports
import { SECURITY_SALT_ROUNDS } from '../../../setup/config/env'
import params from '../../../setup/config/params'
// import { randomNumber, smsOtpSendUrl, isDevelopment } from '../../../setup/helpers/utils'
// import validate from '../../../setup/helpers/validation'
// import { logCreate } from '../../log/mutation'
import User from '../model'

// Signup - Customer
export default async function signup({ params: { firstName,lastName, mobile,team,username, password  }, translate }) {
 
  // Check if user exists with same email
  // const userCheckUsername = await User.findOne({ username })

  // if(!userCheckUsername) {
   
      try {
        const passwordHashed = await bcrypt.hash(password, SECURITY_SALT_ROUNDS)

     

        const userData = {
          firstName,
          lastName,
          mobile,
          team,
          username,
          password: passwordHashed,
          role: params.user.roles.user.key,
         
        }

        const errHandler=(err)=>{
          console.log("Error:"+err);
        }
        
        const user = await User.create(userData).catch(errHandler)

          return {
            data: [user],
            message:"User created successfully!!"
          }
        
      } catch (error) {
        await logCreate({ params: { payload: { method: 'userSignup', message: error.message } } })

        throw new Error(translate.t('common.messages.error.server'))
      }
   
  // } else {
  //   throw new Error(translate.t('user.signup.messages.exists'))
  // }


  //throw new Error(translate.t('common.messages.error.default'))
    }
