const { test, describe } = require('node:test')
const assert = require('node:assert')
const mostBlogs = require('../utils/list_helper').mostBlogs
const { blogsSingle, blogsMixed, blogsWithNoLikes } = require('../utils/list_helper').sampleBlogs

describe('most blogs', () => {
  test('of one blog is the author of that blog', () => {
    const result = mostBlogs(blogsSingle)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 1
    })
  })
  
  test('of many blogs is calculated right', () => {
    const result = mostBlogs(blogsMixed)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3
    })
  })

  test('of an empty list is null', () => {
    const result = mostBlogs([])
    assert.deepStrictEqual(result, null)
  })
})