import React, {useState} from 'react'

const CreateForm = ({ create}) => {
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('') 

  const handleCreate = async(event)=>{
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url,
      }
    create(blogObject)
  }
  return (
    <div>
      <h2>creat new</h2>
      <form onSubmit={handleCreate}>
      <div>
        title:<input 
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          />
      </div>
      <div>
        author:<input 
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          />
      </div>
      <div>
        url:<input 
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          />
      </div>
      <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateForm