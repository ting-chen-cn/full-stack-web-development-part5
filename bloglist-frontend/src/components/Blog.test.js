import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('Blog render test', () => {
  let component = {}
  beforeEach(() => {
    const blog = {
      title: 'React patterns',
      url: 'https://reactpatterns.com/',
      author: 'Michael Chan',
      likes: 1,
      user: '5fe88b139fd2ad3fda514ede',
    }
    const user = {
      name: 'Michael Chan',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1pY2hhZWwgQ2hhbiIsImlkIjoiNWZlODhiMTM5ZmQyYWQzZmRhNTE0ZWRkIiwiaWF0IjoxNjA5MjUyMjU4fQ.v8u0wbDHB8Y_eBD4nQxCaXbXyjhrGqY5cKd2As5ADMk',
      username: 'Michael Chan',
    }
    const mockHandler = jest.fn()
    component = render(
      <Blog blog={blog} user={user} toggleVisibility={mockHandler} />
    )
  })

  test('default render the title and author of a blog', () => {
    const basicBlog = component.container.querySelector(
      '.basicContent'
    )
    const detailedContent = component.container.querySelector(
      '.detailedContent'
    )
    console.log(prettyDOM(basicBlog))
    expect(basicBlog).toHaveStyle('display: block')
    expect(detailedContent).toHaveStyle('display: none')
    expect(basicBlog).toHaveTextContent('React patterns')
    expect(basicBlog).toHaveTextContent('Michael Chan')
  })

  test('default not render the  url or number of likes of a blog', () => {
    const basicBlog = component.container.querySelector(
      '.basicContent'
    )
    expect(basicBlog).toHaveStyle('display: block')
    expect(basicBlog).not.toHaveTextContent(
      'https://reactpatterns.com/'
    )
    expect(basicBlog).not.toHaveTextContent(
      '5fe88b139fd2ad3fda514ede'
    )
    expect(basicBlog).not.toHaveTextContent(1)
  })

  test('toggle view button render blog details instead of basic information', () => {
    const button = component.getByText('view')
    fireEvent.click(button)
    const basicBlog = component.container.querySelector(
      '.basicContent'
    )
    expect(basicBlog).toHaveStyle('display: none')
    const detailedContent = component.container.querySelector(
      '.detailedContent'
    )
    expect(detailedContent).toHaveStyle('display: block')
  })
})
