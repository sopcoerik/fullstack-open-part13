const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const errorWare = (error, _request, response, next) => {
  if(error.errors && error.errors[0].type === 'Validation error') {
    response.status(404).send({
      error: 'Invalid data provided',
      message: error.errors[0].message
    })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorizationToken = request.get('authorization')

  if(authorizationToken && authorizationToken.toLowerCase().startsWith('bearer ')) {
    try {
      request.decodedToken = jwt.verify(authorizationToken.substring(7), SECRET)
    } catch (error) {
      response.status(404).send({ error: 'invalid token' })
    }
  } else {
    response.status(404).send({ error: 'missing token' })
  }

  next()
}

module.exports = {
  errorWare,
  tokenExtractor
}