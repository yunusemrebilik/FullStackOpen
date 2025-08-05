const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    request.token = auth.slice('Bearer '.length)
  } else {
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {
  if (request.method !== 'POST' && request.method !== 'DELETE') {
    return next()
  }
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  request.user = await User.findById(decodedToken.id)

  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}