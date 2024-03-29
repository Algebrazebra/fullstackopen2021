import React, { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import Notification from "./components/Notification"
import LoginForm from "./components/LoginForm"
import LogoutForm from "./components/LogoutForm"
import CreateNewBlog from "./components/CreateNewBlog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Togglable from "./components/Togglable"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const createNewBlogRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("loggedInUser")
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedInUser = await loginService.login({
        username: username,
        password: password,
      })
      setUser(loggedInUser)
      blogService.setToken(loggedInUser.token)
      window.localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser))
      setUsername("")
      setPassword("")
    } catch (error) {
      setUser(null)
      setUsername("")
      setPassword("")
      setNotification("invalid username and/or password")
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

  const updateBlogsState = (updatedBlog) => {
    const updatedBlogs = blogs.map((b) =>
      b.id === updatedBlog.id ? updatedBlog : b
    )
    setBlogs(updatedBlogs)
  }

  const removeFromBlogs = (blogId) => {
    const updatedBlogs = blogs.filter((b) => b.id !== blogId)
    setBlogs(updatedBlogs)
  }

  const handleBlogCreation = async (event, blogTitle, blogAuthor, blogUrl) => {
    event.preventDefault()
    const newBlog = await blogService.create({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    })
    createNewBlogRef.current.toggleVisibility()
    setBlogs(blogs.concat(newBlog))
    setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const BlogList = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <LogoutForm user={user} handleLogout={handleLogout} />
      <Togglable buttonLabel="create new blog" ref={createNewBlogRef}>
        <CreateNewBlog handleBlogCreation={handleBlogCreation} />
      </Togglable>
      {blogs
        .sort((b1, b2) => b2.likes - b1.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlogs={updateBlogsState}
            removeFromBlogs={removeFromBlogs}
            currentUserId={user.id}
          />
        ))}
    </div>
  )

  return (
    <div>
      {user === null ? (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={(e) => setUsername(e.target.value)}
          handlePasswordChange={(e) => setPassword(e.target.value)}
          handleLogin={handleLogin}
          notification={notification}
        />
      ) : (
        <BlogList />
      )}
    </div>
  )
}

export default App
