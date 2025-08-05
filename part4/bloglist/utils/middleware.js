const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    request.token = auth.slice('Bearer '.length)
  } else {
    request.token = null
  }

  next()
}

module.exports = {
  tokenExtractor
}