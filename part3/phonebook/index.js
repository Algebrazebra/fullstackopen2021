require('dotenv').config()
const express = require('express')
var logger = require('morgan')

const app = express()
app.use(express.static('build'))
app.use(express.json())

logger.token('body', (req, res) => { return JSON.stringify(req.body) } )
app.use(logger(':method :url :status :res[content-length] - :response-time ms :body'))


const Person = require('./models/person')


app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  }
  Person
    .findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
        error: 'content missing'
    })
  }
  const person = new Person({
      name: body.name,
      number: body.number
  })
  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(formattedPerson => response.json(formattedPerson))
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({}, (error, count) => {
    const htmlString = `<div>Phonebook has info for ${count} persons.</div><div>${new Date().toLocaleString()}</div>`
    response.set('Content-Type', 'text/html')
    response.send(Buffer.from(htmlString))
  })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler) // must be last loaded middleware

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})