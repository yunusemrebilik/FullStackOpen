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

test('the unique identifier is named id not _id', async () => {
  const response = await api.get('/api/blogs')
  const randomIndex = Math.floor(Math.random() * helper.initialBlogs.length)
  const randomNote = response.body[randomIndex]
  assert(randomNote.hasOwnProperty('id'))
  assert(!randomNote.hasOwnProperty('_id'))
})

test('each post request creates exactly one blog, with the given data', async () => {
  const blogsAtStart =  await helper.blogsInDB()
  const blogToSave = helper.dummyNote

  const response = await api
    .post('/api/blogs')
    .send(blogToSave)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDB()  
  assert.deepEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  delete response.body.id // ids are inherently unique
  assert.deepStrictEqual(response.body, blogToSave)
})

test('if the likes property is missing its value set to zero, by default', async () => {
  const blogToSave = helper.dummyNote
  const likes = blogToSave.likes
  delete blogToSave.likes

  const response = await api
    .post('/api/blogs')
    .send(blogToSave)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
  assert.notStrictEqual(response.body.likes, likes)
})

test('if the title or url is missing blog is not created', async () => {
  const blogToSave = helper.dummyNote
  const randomBool = !!Math.floor(Math.random() * 2)
  if (randomBool) {
    delete blogToSave.title
  } else {
    delete blogToSave.url
  }

  await api
    .post('/api/blogs')
    .send(blogToSave)
    .expect(400)
})

test('deletion of a blog succeeds if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDB()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
  
  const blogsAtEnd = await helper.blogsInDB()

  assert(blogsAtStart.map(b => b.id).includes(blogToDelete.id))
  assert(!blogsAtEnd.map(b => b.id).includes(blogToDelete.id))
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('deletion of non existing blog changes nothing', async () => {
  const blogsAtStart = await helper.blogsInDB()
  const nonExistingId = "a bunch of random word"

  await api.delete(`/api/blogs/${nonExistingId}`)

  const blogsAtEnd = await helper.blogsInDB()

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  assert.deepStrictEqual(blogsAtEnd, blogsAtStart)
})

test.only('updating a blog succeeds if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDB()

  const blogToUpdate = {
    id: blogsAtStart[0].id,
    title: 'Updated',
    author: 'Updated',
    url: 'Updated',
    likes: 999
  }

  const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate).expect(200)
  const blogsAtEnd = await helper.blogsInDB()

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  assert.notDeepStrictEqual(blogsAtEnd, blogsAtStart)
  assert.deepStrictEqual(response.body, blogToUpdate)
})

test.only('updating a blog does not exist does not change anything', async () => {
  const blogsAtStart = await helper.blogsInDB()
  const nonExistingId = 'random words here and there'

  await api.put(`/api/blogs/${nonExistingId}`)
  const blogsAtEnd = await helper.blogsInDB()

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  assert.deepStrictEqual(blogsAtEnd, blogsAtStart)
})

after(async () => {
  await mongoose.connection.close()
})