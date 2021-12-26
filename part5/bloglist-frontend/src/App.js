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
  const [notification, setNotification] = useState(null)

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
      setNotification(`invalid username and/or password`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.clear()
  }

  const handleBlogCreation = async (event) => {
    event.preventDefault()
    const newBlog = await blogService.create({
      'title': blogTitle,
      'author': blogAuthor,
      'url': blogUrl
    })
    setBlogs(blogs.concat(newBlog))
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
    setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>login to application</h2>
      <Notification message={notification} />
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
      <Notification message={notification} />
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

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
    return (
      <div className="error">{message}</div>
    )
  }

  return (
    <div>
      {user === null ? loginForm() : blogList()}
    </div>
  )
}

export default App