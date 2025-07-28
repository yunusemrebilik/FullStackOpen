const { test, describe } = require('node:test')
const assert = require('node:assert')
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const { blogsSingle, blogsMixed, blogsWithNoLikes } = require('../utils/list_helper').sampleBlogs

describe('favorite blog', () => {
  test('of one blog is the blog itself', () => {
    const result = favoriteBlog(blogsSingle)
    assert.deepStrictEqual(result, blogsSingle[0])
  })
  
  test('of many blogs is calculated right', () => {
    const result = favoriteBlog(blogsMixed)
    assert.deepStrictEqual(result, blogsMixed[2])
  })

  test('of blogs that have no likes, equals to one of them (zero)', () => {
    const result = favoriteBlog(blogsWithNoLikes)
    assert.deepStrictEqual(result, blogsWithNoLikes[0])
  })

  test('of an empty list is null', () => {
    const result = favoriteBlog([])
    assert.deepStrictEqual(result, null)
  })
})