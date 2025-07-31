const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')

const initialBlogs = listHelper.sampleBlogs.blogsMixed

const dummyNote = {
  title: 'Don Quixote',
  author: 'Miguel de Cervantes',
  url: 'google.com/search?q=Don-Quixote',
  likes: 5
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs,
  dummyNote,
  blogsInDB
}