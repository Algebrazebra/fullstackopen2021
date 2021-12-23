const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')


logger.info('Connecting to MongoDB...')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Established connection to MongoDB.')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

const app = express()
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app