const { AuthenticationError } = require('apollo-server')

const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (context) => {
  const authHeader =
    typeof context === 'string' ? context : context.req.headers.authorization
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1]
    if (token) {
      try {
        const user = jwt.verify(token, 'secretkey')
        return user
      } catch (err) {
        console.error('Invalid Or Expired Token')
        throw new AuthenticationError('Invalid Or Expired Token')
      }
    }
    console.error('Authentication Token Must Be: Bearer [token]')
    throw new AuthenticationError(
      'Authentication Token Must Be: Bearer [token]'
    )
  }

  console.error('Authorization Header Must Be Provided')
  throw new AuthenticationError('Authorization Header Must Be Provided')
}
