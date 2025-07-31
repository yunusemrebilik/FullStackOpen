const assert = require('node:assert')
const { test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('all blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('the unique identifier is named id not _id', async () => {
  const response = await api.get('/api/blogs')
  const randomIndex = Math.floor(Math.random() * helper.initialBlogs.length)
  const randomNote = response.body[randomIndex]
  assert(randomNote.hasOwnProperty('id'))
  assert(!randomNote.hasOwnProperty('_id'))
})

after(async () => {
  await mongoose.connection.close()
})