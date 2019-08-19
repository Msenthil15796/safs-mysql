// App Imports
import { SMS_KEY, NODE_ENV } from '../config/env'
import params from '../config/params'

// Utility functions

// Env
export function isDevelopment() {
  return NODE_ENV === 'development'
}
export function isProduction() {
  return NODE_ENV === 'production'
}

// No operation
export const noop = () => {}

// Generate random number
export function randomNumber(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

// Auth check user
export function authCheck(auth) {
  return auth && auth.user && auth.user.id
}

// Auth check vendor
export function authCheckFinance(auth) {
  return authCheck(auth) && auth.user.role === params.user.roles.finance.key
}

// Auth check vendor
export function authCheckVendor(auth) {
  return authCheck(auth) && auth.user.role === params.user.roles.vendor.key
}

// Auth check admin
export function authCheckAdmin(auth) {
  return authCheck(auth) && auth.user.role === params.user.roles.admin.key
}

// Slug
export function slug(text) {
  return text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
}

// Random string generator
export function randomString(length) {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for(let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text
}

// SMS API URL
export function smsOtpSendUrl(mobile, otp) {
  return `https://2factor.in/API/V1/${ SMS_KEY }/SMS/${ mobile }/${ otp }/SMS Verification`
}