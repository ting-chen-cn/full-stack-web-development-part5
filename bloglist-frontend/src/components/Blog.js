import React, { useState } from 'react'

const Blog = ({ blog, likeBlog, user, remove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showDeletable = {
    display: blog.user.username === user.username ? '' : 'none',
  }
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const handleLike = (event) => {
    event.preventDefault()
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    likeBlog(blogObject, blog.id)
  }

  const handleRemove = (event) => {
    event.preventDefault()
    window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    remove(blog.id)
  }
  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className='basicContent'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className='detailedContent'>
        <div>
          <div>
            {blog.title}
            <button onClick={toggleVisibility}>hide</button>
          </div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.author}</div>
        </div>
        <div style={showDeletable}>
          <button onClick={handleRemove}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
