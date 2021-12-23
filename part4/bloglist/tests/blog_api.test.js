const mongoose = require('mongoose')
const supertest = require('supertest')
const testBlogs = require('./test_blog_list')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  for (const b of testBlogs) {
    const blogObject = new Blog(b)
    await blogObject.save()
  }
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
    response.body.forEach(b => expect(b._id).toBeDefined())
  })

  test('new blog post creation is successful', async () => {
    const blogsCountBefore = await Blog.countDocuments({})

    const newBlog = {
      title: 'Successful Blog Creation Test',
      author: 'Jest Test Runner',
      url: 'www.google.at',
      likes: 0,
    }
    await api
      .post('/api/blogs')
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
    const response = await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(0)
  })

  test('missing title and url property returns 400', async () => {
    const newBlog = {
      author: 'Missing title and url',
    }
    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(400)
  })

  test('deleting post works', async () => {
    const blogsCountBefore = await Blog.countDocuments({})
    await api
      .delete('/api/blogs/5a422a851b54a676234d17f7')
      .expect(204)
    const blogsCountAfter = await Blog.countDocuments({})
    expect(blogsCountAfter).toEqual(blogsCountBefore - 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})