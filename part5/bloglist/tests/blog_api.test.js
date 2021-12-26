const mongoose = require('mongoose')
const supertest = require('supertest')
const testBlogs = require('./test_blog_list')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)


async function createAuthHeader() {
  const login = await api
    .post('/api/login')
    .send({
      'username': 'testuser',
      'password': 'sekret'
    })
  const authHeader = { 'Authorization': `bearer ${login.body.token}` }
  return authHeader
}

beforeEach(async () => {
  await Blog.deleteMany({})
  for (const b of testBlogs) {
    const blogObject = new Blog(b)
    await blogObject.save()
  }

  await User.deleteMany({})
  await api
    .post('/api/users')
    .send({
      'username': 'testuser',
      'name': 'testuser',
      'password': 'sekret'
    })
})

describe('blog api', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct amount of blog posts are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(testBlogs.length)
  })

  test('unique identifier exists', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(b => expect(b.id).toBeDefined())
  })

  test('new blog post creation is successful', async () => {
    const blogsCountBefore = await Blog.countDocuments({})

    const newBlog = {
      title: 'Successful Blog Creation Test',
      author: 'Jest Test Runner',
      url: 'www.google.at',
      likes: 0,
    }
    const headers = await createAuthHeader()
    await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsCountAfter = await Blog.countDocuments({})
    expect(blogsCountAfter).toBe(blogsCountBefore + 1)
  })

  test('blog post likes default to zero', async () => {
    const newBlog = {
      title: 'Default likes are zero',
      author: 'Jest Test Runner',
      url: 'www.google.at'
    }
    const headers = await createAuthHeader()
    const response = await api
      .post('/api/blogs/')
      .set(headers)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(0)
  })

  test('missing title and url property returns 400', async () => {
    const newBlog = {
      author: 'Missing title and url',
    }
    const headers = await createAuthHeader()
    await api
      .post('/api/blogs/')
      .set(headers)
      .send(newBlog)
      .expect(400)
  })

  test('deleting post works', async () => {
    const blogsCountBefore = await Blog.countDocuments({})
    const newBlog = {
      title: 'Blog to be deleted',
      author: 'Jest Test Runner',
      url: 'www.a-url.com',
      likes: 0,
    }
    const headers = await createAuthHeader()
    const response = await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    await api
      .delete(`/api/blogs/${response.body.id}`)
      .set(headers)
      .expect(204)
    const blogsCountAfter = await Blog.countDocuments({})
    expect(blogsCountAfter).toEqual(blogsCountBefore)
  })

  test('updating post works', async () => {
    const updatedBlog = { ...testBlogs[0], title: 'Updated title' }
    await api
      .put(`/api/blogs/${updatedBlog._id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const updatedBlogInDB = await Blog.findById(updatedBlog._id)
    expect(updatedBlogInDB.title).toBe('Updated title')
  })

  test('adding a blog fails without authorization', async () => {
    const newBlog = {
      title: 'Unauthorized because headers are not set.',
      author: 'An author',
      url: 'www.a-url.com',
      likes: 0,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
})