const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, getBlogDiv, likeBlog, deleteBlog, logout, createUser, expandDetails, shrinkDetails } = require('./helper')
const ROOT = {
  name: 'default user',
  username: 'root',
  password: 'root'
}

const sampleBlog = {
  title: 'blog-a',
  author: 'author-a',
  url: 'url-a'
}

const sampleSeveralBlogs = [
  {
    title: 'blog-0',
    author: 'author-0',
    url: 'url-0'
  },
  {
    title: 'blog-1',
    author: 'author-1',
    url: 'url-1'
  },
  {
    title: 'blog-2',
    author: 'author-2',
    url: 'url-2'
  },
  {
    title: 'blog-3',
    author: 'author-3',
    url: 'url-3'
  }
]

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:5173/api/testing/reset')
    await createUser(request, ROOT)
    
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, ROOT.username, ROOT.password)
      await page.getByRole('button', { name: 'log out' }).waitFor({ status: 'visible' })

      await expect(page.getByText(`${ROOT.name} logged in`)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, ROOT.username, 'wrong')
      
      await expect(page.getByText('invalid username or password')).toBeVisible()
      await expect(page.getByText(`${ROOT.name} logged in`)).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, ROOT.username, ROOT.password)
      await page.getByRole('button', { name: 'log out' }).waitFor({ status: 'visible' })
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, sampleBlog)

      expect(page.getByText(`A new blog "${sampleBlog.title}" by ${sampleBlog.author} has been added`)).toBeVisible()
      expect(page.getByText(`${sampleBlog.title} by ${sampleBlog.author}`)).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, sampleBlog)
      })

      test('details of a blog can be seen', async ({ page }) => {
        const blogDiv = getBlogDiv(page, sampleBlog)
        await expandDetails(blogDiv)

        await expect(page.getByText(sampleBlog.url)).toBeVisible()
        await expect(page.getByText('0')).toBeVisible() // 0 for inital likes
      })

      describe('when its details expanded', () => {
        beforeEach(async ({ page }) => {
          const blogDiv = getBlogDiv(page, sampleBlog)
          await expandDetails(blogDiv)
        })

        test('a blog can be liked', async ({ page }) => {
          const blogDiv = getBlogDiv(page, sampleBlog)

          await expect(blogDiv).toContainText('0')
          await likeBlog(page, blogDiv, sampleBlog)
          await expect(blogDiv).toContainText('1')
        })

        test('a blog can deleted by its owner', async ({ page }) => {
          const blogDiv = getBlogDiv(page, sampleBlog)

          await expect(page.getByText(`${sampleBlog.title} by ${sampleBlog.author}`)).toBeVisible()
          await deleteBlog(page, blogDiv, sampleBlog)
          await expect(page.getByText(`${sampleBlog.title} by ${sampleBlog.author}`)).not.toBeVisible()
        })

        test('remove button for deleting a blog is only avaliable to its owner', async ({ page, request }) => {
          const blogDiv = getBlogDiv(page, sampleBlog)
          await expect(blogDiv.getByRole('button', { name: 'remove' })).toBeVisible()

          const differentUser = {
            name: 'different',
            username: 'different',
            password: 'different'
          }
          await logout(page)
          await createUser(request, differentUser)
          await loginWith(page, differentUser.username, differentUser.password)
          await page.getByRole('button', { name: 'log out' }).waitFor({ status: 'visible' })
          
          const newBlogDiv = getBlogDiv(page, sampleBlog)
          await expandDetails(newBlogDiv)
          await expect(newBlogDiv.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })
      })
    })

    describe('and several blogs exists', () => {
      beforeEach(async ({ page }) => {
        for (let blog of sampleSeveralBlogs) {
          await createBlog(page, blog)
          blog.likes = 0
        }
      })

      test('blogs are sorted by their like count', async ({ page }) => {
        let blogDivs = []
        for (let blog of sampleSeveralBlogs) {
          blogDivs.push(getBlogDiv(page, blog, false))
        }

        // 2 likes for the blog index: 0
        await expandDetails(blogDivs[0])
        for (let i = 0; i < 2; i++) {
          await likeBlog(page, blogDivs[0], sampleSeveralBlogs[0], i)
          sampleSeveralBlogs[0].likes++
        }
        await shrinkDetails(blogDivs[0])

        // 3 likes for the blog index: 1
        await expandDetails(blogDivs[1])
        for (let i = 0; i< 3; i++) {
          await likeBlog(page, blogDivs[1], sampleSeveralBlogs[1], i)
          sampleSeveralBlogs[1].likes++
        }
        await shrinkDetails(blogDivs[1])

        // 4 likes for the blog index: 3
        await expandDetails(blogDivs[3])
        for (let i = 0; i < 4; i++) {
          await likeBlog(page, blogDivs[3], sampleSeveralBlogs[3], i)
          sampleSeveralBlogs[3].likes++
        }
        await shrinkDetails(blogDivs[3])
        
        // likes [2, 3, 0, 4]
        // order must be (index) [3, 1, 0, 2]
        const matchedDivs = []
        for (let i = 0; i < sampleSeveralBlogs.length; i++) {
          matchedDivs.push(page.getByText('by').nth(i).locator('..'))
        }

        // sort the array by like of each blog
        const sortedBlogs = [...sampleSeveralBlogs].sort((a, b) => b.likes - a.likes)
        for (let i = 0; i < sortedBlogs.length; i++) {
          expect(matchedDivs[i]).toContainText(`${sortedBlogs[i].title} by ${sortedBlogs[i].author}`)
        }
      })
    })
  })
})