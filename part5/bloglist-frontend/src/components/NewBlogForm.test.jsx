import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NewBlogForm from "./NewBlogForm";
import userEvent from "@testing-library/user-event";

test('event handler is called with the right details', async () => {
  const user = userEvent.setup()
  const mockHandler = vi.fn()

  const { container } = render(<NewBlogForm addNewBlog={mockHandler} /> )

  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'new title')
  await user.type(authorInput, 'new author')
  await user.type(urlInput, 'new url')
  await user.click(createButton)

  expect(JSON.stringify(mockHandler.mock.calls[0][0])).toBe(JSON.stringify({
    title: 'new title',
    author: 'new author',
    url: 'new url'
  }))
})