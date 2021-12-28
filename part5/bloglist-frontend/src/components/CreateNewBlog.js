import React, { useState } from "react"
import blogService from "../services/blogs"

const CreateNewBlog = ({ postActions }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')

  const handleBlogCreation = async (event) => {
    event.preventDefault()
    const newBlog = await blogService.create({
      'title': blogTitle,
      'author': blogAuthor,
      'url': blogUrl
    })
    postActions(newBlog)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleBlogCreation}>
      <div>
          title
          <input
            type="text"
            value={blogTitle}
            name="Title"
            onChange={e => setBlogTitle(e.target.value)}
          />
        </div>
      <div>
        author
        <input
          type="text"
          value={blogAuthor}
          name="Author"
          onChange={e => setBlogAuthor(e.target.value)}
        />
      </div>
      <div>
      url
        <input
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