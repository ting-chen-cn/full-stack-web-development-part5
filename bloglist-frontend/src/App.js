import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateForm from './components/CreateForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) =>
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      'loggedBlogUser'
    )
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleCreate = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      await blogService.create(blogObject)
      blogService
        .getAll()
        .then((blogs) =>
          setBlogs(blogs.sort((a, b) => b.likes - a.likes))
        )
      setMessage(
        `a new blog ${blogObject.title} by ${user.username} added`
      )
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Failed to add blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const likeBlog = async (blogObject, id) => {
    try {
      await blogService.updateLikes(blogObject, id)
      blogService
        .getAll()
        .then((blogs) =>
          setBlogs(blogs.sort((a, b) => b.likes - a.likes))
        )
      setMessage(`${blogObject.title} is liked by ${user.username}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Failed to add like')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id)
      blogService
        .getAll()
        .then((blogs) =>
          setBlogs(blogs.sort((a, b) => b.likes - a.likes))
        )
      setMessage('Blog removed!')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Failed to remove blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <ErrorNotification errorMessage={errorMessage} />
        <LoginForm
          setErrorMessage={setErrorMessage}
          setMessage={setMessage}
          setUser={setUser}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <ErrorNotification errorMessage={errorMessage} />
      <>{user.username} logged in</>
      <button
        type='submit'
        id='logoutButton'
        onClick={() => {
          window.localStorage.clear()
          setUser(null)
        }}
      >
        logout
      </button>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <CreateForm create={handleCreate} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          user={user}
          remove={handleRemove}
        />
      ))}
    </div>
  )
}

export default App
