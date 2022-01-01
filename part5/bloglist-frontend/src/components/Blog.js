import React, { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'


const Blog = ({ blog, updateBlogs, removeFromBlogs, currentUserId }) => {

  const [isDetailShown, setIsDetailShown] = useState(false)

  const isAuthor = (blog, currentUserId) => {
    try {
      return blog.user.id === currentUserId
    } catch {
      return false
    }
  }

  const toggleDetails = () => {
    setIsDetailShown(!isDetailShown)
  }

  const viewHideLabel = isDetailShown ? 'hide' : 'view'

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

  const deleteBlog = async (blog) => {
    window.confirm(`Remove ${blog.title} by ${blog.author}?`)
    await blogService.remove(blog.id)
    removeFromBlogs(blog.id)
  }

  const DeleteButton = (buttonLabel, blog) => {
    return (
      <>
      <br />
      <button onClick={() => deleteBlog(blog)}>{buttonLabel}</button>
      </>
    )
  }

  const BlogDetail = (blog, isAuthor) => {
    return (
      <div>
        {blog.url}<br />
        likes: {blog.likes} <button onClick={() => increaseLike(blog)}>like</button> <br />
        {typeof(blog.user) !== 'undefined' && blog.user.name}
        {isAuthor && DeleteButton('delete', blog)}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleDetails}>{viewHideLabel}</button>
      {isDetailShown && BlogDetail(blog, isAuthor(blog, currentUserId))}
    </div>  
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlogs: PropTypes.func.isRequired,
  removeFromBlogs: PropTypes.func.isRequired,
  currentUserId: PropTypes.string.isRequired
}

export default Blog