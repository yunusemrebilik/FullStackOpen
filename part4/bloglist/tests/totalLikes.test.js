const { test, describe } = require('node:test')
const assert = require('node:assert')
const totalLikes = require('../utils/list_helper').totalLikes
const { blogsSingle, blogsMixed, blogsWithNoLikes } = require('../utils/list_helper').sampleBlogs

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(blogsSingle)
    assert.strictEqual(result, 5)
  })
  
  test('of many blogs is calculated right', () => {
    const result = totalLikes(blogsMixed)
    assert.strictEqual(result, 36)
  })

  test('of blogs that have no likes, equals to 0 (zero)', () => {
    const result = totalLikes(blogsWithNoLikes)
    assert.strictEqual(result, 0)
  })

  test('of an empty list is 0 (zero)', () => {
    const result = totalLikes([])
    assert.strictEqual(result, 0)
  })
})