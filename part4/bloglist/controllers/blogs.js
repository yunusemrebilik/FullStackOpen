const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  try {
    const user = request.user
    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }
    const blog = new Blog(request.body)
    blog.user = user

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog)
    await user.save()

    // why I'm not using just response.status(201).json(savedBlog) 
    // because it didn't work with supertest
    // (though I don't know the actual cause, it's just my observation)
    // and I spent hours to figure it out
    // then come up with a "solution" like this
    const blogToTest = await Blog.findById(savedBlog._id)
    const transformedBlog = blogToTest.toJSON()
    response.status(201).send(transformedBlog)

  } catch (exception) {
    response.status(400).json({ error: exception.message })
  }
})

blogRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).json({ error: 'invalid id of blog' })
  }
  
  if (!request.user || blog.user.toString() !== request.user.id.toString()) {
    return response.status(401).json({ error: 'userId missing or not valid' })
  }
  
  await blog.deleteOne()
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes || 0

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogRouter