const createUser = async (request, user) => {
  await request.post('http://localhost:5173/api/users', {
    data: {
      name: user.name,
      username: user.username,
      password: user.password
    }
  })
}

const loginWith = async (page, username, password) => {
  await page.getByRole('textbox', { name: 'username' }).fill(username)
  await page.getByRole('textbox', { name: 'password' }).fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, content) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByRole('textbox', { name: 'title' }).fill(content.title)
  await page.getByRole('textbox', { name: 'author' }).fill(content.author)
  await page.getByRole('textbox', { name: 'url' }).fill(content.url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`${content.title} by ${content.author}`).waitFor({ state: 'visible' })
}

const getBlogDiv = (page, blog, expanded = true) => {
  const titleDiv = page.getByText(`${blog.title} by ${blog.author}`)
  const blogDiv = expanded ? titleDiv.locator('..').locator('..') : titleDiv.locator('..')
  return blogDiv
}

const expandDetails = async (blogDiv) => {
  await blogDiv.getByRole('button', { name: 'view' }).click()
  await blogDiv.getByRole('button', { name: 'hide' }).waitFor({ state: 'visible' })
}

const shrinkDetails = async (blogDiv) => {
  await blogDiv.getByRole('button', { name: 'hide' }).click()
  await blogDiv.getByRole('button', { name: 'view' }).waitFor({ status: 'visible' })
}

const likeBlog = async (page, locator, blog, old=0) => {
  await locator.getByRole('button', { name: 'like' }).click()
  await page.getByText(`"${blog.title}" has been liked (${old + 1} likes)`).waitFor({ status: 'visible' })
}

const deleteBlog = async (page, locator, blog) => {
  page.on('dialog', dialog => dialog.accept())

  await locator.getByRole('button', { name: 'remove' }).click()
  await page.getByText(`"${blog.title}" has been removed`).waitFor({ status: 'visible' })
}

const logout = async (page) => {
  await page.getByRole('button', { name: 'log out' }).click()
  await page.getByRole('button', { name: 'login' }).waitFor({ status: 'visible' })
}

export {
  createUser,
  loginWith,
  createBlog,
  getBlogDiv,
  expandDetails,
  shrinkDetails,
  likeBlog,
  deleteBlog,
  logout
}