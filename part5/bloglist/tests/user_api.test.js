const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)


beforeEach(async () => {
  await User.deleteMany({})
})

describe('user api', () => {

  test('missing username fails with appropriate error', async () => {
    const invalidUser = {
      'name': 'Max Mustermann',
      'password': 'password'
    }
    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('username of insufficient length fails with appropriate error', async () => {
    const invalidUser = {
      'username': 'aa',
      'password': 'password',
    }
    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('password of insufficient length fails with appropriate error', async () => {
    const invalidUser = {
      'username': 'maxmustermann',
      'password': 'pw',
    }
    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

})

afterAll(() => {
  mongoose.connection.close()
})