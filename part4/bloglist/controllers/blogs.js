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
    blog.user = user._id

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const blogToTest = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
    response.status(201).send(blogToTest)

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