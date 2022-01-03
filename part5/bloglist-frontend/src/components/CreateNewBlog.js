import React, { useState } from 'react'
import blogService from '../services/blogs'

const CreateNewBlog = ({ handleBlogCreation }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={e => handleBlogCreation(e, blogTitle, blogAuthor, blogUrl)}>
        <div>
          title
          <input
            id='title'
            type="text"
            value={blogTitle}
            name="Title"
            onChange={e => setBlogTitle(e.target.value)}
          />
        </div>
        <div>
        author
          <input
            id='author'
            type="text"
            value={blogAuthor}
            name="Author"
            onChange={e => setBlogAuthor(e.target.value)}
          />
        </div>
        <div>
          url
          <input
            id='url'
            type="text"
            value={blogUrl}
            name="URL"
            onChange={e => setBlogUrl(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateNewBlog