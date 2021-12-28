import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({blog}) => {

  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async (blog) => {
    var updatedBlog = {
      id: blog.id,
      title: blog.title,
      url: blog.url,
      likes: blog.likes + 1
    }
    if (typeof(blog.user) !== 'undefined') {
      updatedBlog['user'] = blog.user.id
    }
    await blogService.update(updatedBlog)
  }

  const BlogDetail = () => {
    return (
      <div>
        {blog.url}<br />
        likes: {blog.likes} <button onClick={() => handleLike(blog)}>like</button> <br />
        {typeof(blog.user) !== 'undefined' && blog.user.name}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleDetails}>view</button>
      {showDetails && <BlogDetail />}
    </div>  
  )
}

export default Blog