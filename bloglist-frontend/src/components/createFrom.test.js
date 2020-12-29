import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CreateForm from './CreateForm'

test('<CreateForm /> updates parent state and calls onsubmit', () => {
  const create = jest.fn()
  const component = render(<CreateForm create={create} />)
  const title = component.container.querySelector(
    // eslint-disable-next-line quotes
    "input[name='title']"
  )
  // eslint-disable-next-line quotes
  const url = component.container.querySelector("input[name='url']")
  const author = component.container.querySelector(
    // eslint-disable-next-line quotes
    "input[name='author']"
  )
  const form = component.container.querySelector('form')
  fireEvent.change(title, {
    target: { value: 'testing of forms could be easier' },
  })
  fireEvent.change(url, {
    target: { value: 'http://localhost:3000/' },
  })
  fireEvent.change(author, {
    target: { value: 'Ting Chen' },
  })
  fireEvent.submit(form)
  expect(create.mock.calls).toHaveLength(1)
  console.log(create.mock.calls[0][0])
  expect(create.mock.calls[0][0].title).toBe(
    'testing of forms could be easier'
  )
  expect(create.mock.calls[0][0].url).toBe('http://localhost:3000/')
  expect(create.mock.calls[0][0].author).toBe('Ting Chen')
})
