const mongoose = require('mongoose')
const supertest =  require('supertest')
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

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct amount of blog posts are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(testBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})