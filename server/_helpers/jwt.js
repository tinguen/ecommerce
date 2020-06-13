import config from '../config'

const expressJwt = require('express-jwt')
const userService = require('../users/user.service')

// eslint-disable-next-line consistent-return
async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub)

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true)
  }
  req.user = payload
  done()
}

function jwt() {
  const { secret } = config
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      // public routes that don't require authentication
      new RegExp(
        '^(?!/api/v1/users|/api/v1/orders|/api/v1/products/create|/api/v1/products/delete|/api/v1/images/upload|/api/v1/images/delete|/api/v1/products/user|/api/v1/products/all).*'
      ),
      '/api/v1/users/authenticate',
      '/api/v1/users/register',
      '/api/v1/users/verify_email'
    ]
  })
}

module.exports = jwt
