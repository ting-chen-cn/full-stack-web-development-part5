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
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleCreate = (blogObject) => {
    console.log(blogObject)
    blogFormRef.current.toggleVisibility()
    try{
      blogService.create(blogObject).then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
      })
      setMessage(`a new blog ${blogObject.title} by ${user.username} added`)
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


  
  if (user === null) {
    return (
      <LoginForm setErrorMessage={setErrorMessage} setMessage={setMessage} setUser={setUser} />
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <ErrorNotification errorMessage={errorMessage} />
      <>{ user.username} logged in</>
      <button type="submit" onClick={()=>{window.localStorage.clear(); setUser(null)}} >
        logout
      </button>
      <Togglable 
      buttonLabel='new blog' 
      ref={blogFormRef} 
      content={
      <>
        {blogs.map(blog =>
          <Blog key={blog.id} 
          blog={blog} 
          />
        )}
      </>} 
      >
        <CreateForm
        create={handleCreate}
        />
      </Togglable>
      
      
    </div>
  )
}

export default App