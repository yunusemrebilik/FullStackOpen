const { test, describe } = require('node:test')
const assert = require('node:assert')
const mostLikes = require('../utils/list_helper').mostLikes
const { blogsSingle, blogsMixed } = require('../utils/list_helper').sampleBlogs

describe('most likes', () => {
  test('of one blog is the number of likes that book has', () => {
    const result = mostLikes(blogsSingle)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 5
    })
  })
  
  test('of many blogs is calculated right', () => {
    const result = mostLikes(blogsMixed)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })

  test('of an empty list is null', () => {
    const result = mostLikes([])
    assert.deepStrictEqual(result, null)
  })
})