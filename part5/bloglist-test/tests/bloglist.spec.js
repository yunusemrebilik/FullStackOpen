const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, getBlogDiv, likeBlog, deleteBlog, logout, createUser, expandDetails } = require('./helper')
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
  })
})