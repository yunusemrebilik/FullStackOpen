const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')

const initialBlogs = listHelper.sampleBlogs.blogsMixed

module.exports = {
  initialBlogs
}