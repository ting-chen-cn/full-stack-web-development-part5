import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
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

    component = render(<Blog blog={blog} user={user} />)
  })

  test('default render the title and author of a blog', () => {
    const basicBlog = component.container.querySelector(
      '.basicContent'
    )
    expect(basicBlog).toHaveStyle('display: block')
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
})
