import React, { useState } from 'react'

const CreateForm = ({ create }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url,
    }
    create(blogObject)
  }
  return (
    <div className='formDiv'>
      <h2>creat new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input
            id='title'
            value={title}
            name='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            id='author'
            value={author}
            name='author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id='url'
            value={url}
            name='url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button id='create-button' type='submit'>
          create
        </button>
      </form>
    </div>
  )
}

export default CreateForm
