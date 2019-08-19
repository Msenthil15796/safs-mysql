// Imports
import React from 'react'
import PropTypes from 'prop-types'

import { ADMIN_URL} from '../../../setup/config/env'


// Component
const ResetPassword = ({ token, name }) => (
  <React.Fragment>
    Hi,<br />

    <div style={{ paddingBottom: '5px' }}>Mr./ Mrs. {name}</div> <br />

    <div style={{ paddingBottom: '5px'}}>Greetings!</div> <br />

    <div style={{ paddingBottom: '5px' }}>You are just a step away from accessing your DusMinute account.</div> <br />
  
    <div style={{ paddingBottom: '5px' }}>We are sharing a verification link to access your account.The code is valid for 1 hour and usable only once.</div> <br />

    <div style={{ paddingBottom: '5px' }}>Once you have verified, you'll be prompted to set a new password immediately. This is to ensure that only you have access to your account.</div> <br />

    <div style={{ paddingBottom: '5px' }}>Your LINK: {ADMIN_URL}/resetpassword/{token}</div> <br />

    <div style={{ paddingBottom: '5px' }}>Expires in: 1 hour</div> <br />

    Best Regards, <br />
    <div style={{ paddingBottom: '5px' }}>Team DusMinute</div> <br />

  </React.Fragment>
)

// Component Properties
ResetPassword.propTypes = {
  token: PropTypes.any.isRequired
}

export default ResetPassword
