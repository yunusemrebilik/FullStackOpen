const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')

const initialBlogs = listHelper.sampleBlogs.blogsMixed

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDB
}