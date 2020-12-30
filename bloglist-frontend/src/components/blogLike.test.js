import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('tests for like button', () => {
  test(' if the like button is clicked twice, the mock function is called twice', () => {
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
    const mockLike = jest.fn()
    let component = render(
      <Blog blog={blog} user={user} likeBlog={mockLike} />
    )
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = component.container.querySelector(
      '#likeButton'
    )

    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockLike.mock.calls).toHaveLength(2)
  })
})
