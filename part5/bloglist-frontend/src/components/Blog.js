import React, { useState } from 'react'

const Blog = ({blog}) => {

  const [showDetails, toggleDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const BlogDetail = () => {
    console.log(blog)
    return (
      <div>
        {blog.url}<br />
        likes: {blog.likes} <button>like</button> <br />
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