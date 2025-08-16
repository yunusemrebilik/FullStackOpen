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

const getBlogDiv = (page, blog) => {
  const titleDiv = page.getByText(`${blog.title} by ${blog.author}`)
  const blogDiv = titleDiv.locator('..').locator('..')
  return blogDiv
}

const likeBlog = async (page, locator, blog) => {
  await locator.getByRole('button', { name: 'like' }).click()
  await page.getByText(`"${blog.title}" has been liked`).waitFor({ status: 'visible' })
}

const deleteBlog = async (page, locator, blog) => {
  page.on('dialog', dialog => dialog.accept())

  await locator.getByRole('button', { name: 'remove' }).click()
  // await page.getByRole('button', { name: 'OK' }).click()
  await page.getByText(`"${blog.title}" has been removed`).waitFor({ status: 'visible' })
}

export { loginWith, createBlog, getBlogDiv, likeBlog, deleteBlog }