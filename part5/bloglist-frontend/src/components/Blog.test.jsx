import { test, beforeEach, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

const blog = {
  title: 'test-blog-title',
  author: 'test-blog-author',
  url: 'test-blog-url',
  likes: '0',
}

test('renders only simple content initially', () => {
  const { container } = render(<Blog blog={blog} />)

  const element = container.querySelector('.blog')
  expect(element).toHaveTextContent('test-blog-title by test-blog-author')
  expect(element).not.toHaveTextContent('test-blog-url')
  expect(element).not.toHaveTextContent('0')
})

test('clicking the view button expands the blog details', async () => {
  const { container } = render(<Blog blog={blog} />)
  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  const shrunkView = screen.queryByTestId('shrunkView')
  const expandedView = screen.queryByTestId('expandedView')

  expect(shrunkView).toBeInTheDocument()
  expect(expandedView).toBeNull()
  expect(container.firstChild).not.toHaveTextContent('url')

  await user.click(viewButton)

  const newExpandedView = screen.queryByTestId('expandedView')
  const newShrunkView = screen.queryByTestId('shrunkView')

  expect(newShrunkView).toBeNull()
  expect(newExpandedView).toBeInTheDocument()
  expect(container.firstChild).toHaveTextContent('url')
})

test('if the like button clicked n times, event handler gets n calls', async () => {
  const n = Math.floor(Math.random() * 100)
  const user = userEvent.setup()
  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  for (let i = 0; i < n; i++)
    await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(n)
})