import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlogs }) => {

  const [isDetailShown, setIsDetailShown] = useState(false)

  const toggleDetails = () => {
    setIsDetailShown(!isDetailShown)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const increaseLike = async (blog) => {
    var updatedBlog = { ...blog, likes: blog.likes + 1 }
    if (typeof(blog.user) !== 'undefined') {
      updatedBlog['user'] = blog.user.id
    }
    const response = await blogService.update(updatedBlog)
    updateBlogs(response)
  }

  const BlogDetail = () => {
    return (
      <div>
        {blog.url}<br />
        likes: {blog.likes} <button onClick={() => increaseLike(blog)}>like</button> <br />
        {typeof(blog.user) !== 'undefined' && blog.user.name}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleDetails}>view</button>
      {isDetailShown && <BlogDetail />}
    </div>  
  )
}

export default Blog