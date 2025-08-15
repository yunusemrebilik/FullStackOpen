const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')
const ROOT = {
  name: 'default user',
  username: 'root',
  password: 'root'
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:5173/api/testing/reset')
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: ROOT.name,
        username: ROOT.username,
        password: ROOT.password
      }
    })
    
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

      await expect(page.getByText(`${ROOT.name} logged in`)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, ROOT.username, 'wrong')
      
      await expect(page.getByText('invalid username or password')).toBeVisible()
      await expect(page.getByText(`${ROOT.name} logged in`)).not.toBeVisible()
    })
  })
})