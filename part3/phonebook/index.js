require('dotenv').config()
const express = require('express')
var logger = require('morgan')

const app = express()
logger.token('body', (req, res) => { return JSON.stringify(req.body) } )
app.use(logger(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))
app.use(express.json())

const Person = require('./models/person')

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
})

app.post('/api/persons/', (request, response) => {
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
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/info', (request, response) => {
  Person.countDocuments({}, (error, count) => {
    const htmlString = `<div>Phonebook has info for ${count} persons.</div><div>${new Date().toLocaleString()}</div>`
    response.set('Content-Type', 'text/html')
    response.send(Buffer.from(htmlString))
  })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})