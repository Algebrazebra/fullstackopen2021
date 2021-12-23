require('express-async-errors')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password.length < 3) {
    response.status(400).send({ error: 'Password must be longer than minimum allowed length (3).' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const newUser = User({
      username: body.username,
      name: body.name,
      passwordHash
    })
    const savedUser = await newUser.save()
    response.json(savedUser)
  }
})

module.exports = usersRouter