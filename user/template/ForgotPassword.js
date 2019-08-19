// Imports
import React from 'react'
import PropTypes from 'prop-types'

// Component
const ForgotPassword = ({ otp }) => (
  <React.Fragment>
    Hello, <br/><br/>

    Please use following OTP to reset your password: { otp }
  </React.Fragment>
)

// Component Properties
ForgotPassword.propTypes = {
  otp: PropTypes.any.isRequired
}

export default ForgotPassword
