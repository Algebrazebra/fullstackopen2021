import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedInUser = await loginService.login({'username': username, 'password': password})
      setUser(loggedInUser)
      blogService.setToken(loggedInUser.token)
      window.localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
      setUsername('')
      setPassword('')
    } catch (error) {
      setUser(null)
      setUsername('')
      setPassword('')
      console.log('Invalid username and/or password.')
    }
  }

  const handleLogout = async (event) => {
    setUser(null)
    window.localStorage.clear()
  }

  const handleBlogCreation = async () => {
    const newBlog = await blogService.create({
      'title': blogTitle,
      'author': blogAuthor,
      'url': blogUrl
    })
    console.log(newBlog)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
     <div>
       username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button type="button" onClick={handleLogout}>logout</button>
      </p>
      <h2>create new</h2>
      <form onSubmit={handleBlogCreation}>
        <div>
          title
          <input
            type="text"
            value={blogTitle}
            name="Title"
            onChange={({ target }) => setBlogTitle(target.value)}
          />
          </div>
        <div>
          author
          <input
            type="text"
            value={blogAuthor}
            name="Author"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
        url
          <input
            type="text"
            value={blogUrl}
            name="URL"
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
      <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
    {user === null && loginForm()}
    {user !== null && blogList()}
    </div>
  )
}

export default App