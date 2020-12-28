import React, { useState } from 'react'
const Blog = ({ blogs }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const blogDetail = (blog) => {
    return (
      <div style={blogStyle}>
        <p>
          {blog.title}
          <button>hide</button>
        </p>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes}
          <button>like</button>
        </p>
        <p>{blog.author}</p>
      </div>
    )
  }
  const show = (blog) => {
    if (visible) {
      return blogDetail(blog)
    } else {
      return null
    }
  }

  return (
    <div>
      {blogs.map((blog) => {
        return (
          <div style={blogStyle}>
            {blog.title} {blog.author}
            <button onClick={toggleVisibility}>view</button>
            <div>{show(blog)}</div>
          </div>
        )
      })}
    </div>
  )
}

export default Blog
