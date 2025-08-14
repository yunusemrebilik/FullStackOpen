import { test, beforeEach, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test('renders only simple content initially', () => {
  const blog = {
    title: 'test-blog-title',
    author: 'test-blog-author',
    url: 'test-blog-url',
    likes: '0',
  }

  const container = render(<Blog blog={blog} />).container

  const element = container.querySelector('.blog')
  expect(element).toHaveTextContent('test-blog-title by test-blog-author')
  expect(element).not.toHaveTextContent('test-blog-url')
  expect(element).not.toHaveTextContent('0')
})