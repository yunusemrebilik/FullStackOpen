const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)
    const user = blog.user ? await User.findById(blog.user) : await User.findOne({})

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (exception) {
    response.status(400).json({ error: exception.message })
  }
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
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