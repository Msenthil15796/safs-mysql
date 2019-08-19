// App Imports
import { NODE_ENV } from '../config/env'
import params from '../config/params'
import translate from '../translate'
import authentication from './authentication'
import language from './language'
import modules from './modules'

// Setup endpoint
export default function (server) {
  console.info('SETUP - Endpoint..')

  // API endpoint
  server.all(params.endpoint.url, [authentication, language], async (request, response) => {
    let result = {
      success: false,
      message: 'Please try again.',
      code: '',
      data: null
    }

    // Check if operation to be called is set
    if(request.body.operation) {
      try {
        // Set locale
        translate.locale = request.language

        // Execute operation
        // operationName({ params, fields, auth })
        const {
          success = true,
          message = translate.t('common.messages.success.default'),
          code = '',
          data
        }
        = await modules[request.body.operation]({
          params: request.body.params || {},
          fields: request.body.fields || {},
          auth: request.auth,
          translate
        })

        // Operation executed successfully
        result.success = success
        result.message = message
        result.code = code
        result.data = data
      } catch (error) {
        result.message = modules[request.body.operation] === undefined ? `${ request.body.operation } operation is not available.` : error.message
      }
    }

    // Log info in development mode
    if(NODE_ENV === 'development') {
      console.log(request.body)
      console.log(result.success, result.message)
    }

    // Send response
    response.send(result)
  })
}
