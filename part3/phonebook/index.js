const express = require('express')
var logger = require('morgan')

const app = express()
logger.token('body', (req, res) => { return JSON.stringify(req.body) } )
app.use(logger(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 10_000_000);
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(note => note.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
        error: 'content missing'
    })
  } else if (persons.map(p => p.name).includes(body.name)) {
    return response.status(400).json({
      error: `Person with name ${body.name} already exists.`
    })
  }
  const person = {
      id: generateId(),
      name: body.name,
      number: body.number
  }
  persons = persons.concat(person)
  response.json(person)
})

app.get('/info', (request, response) => {
    const info = {
        "people": persons.length,
        "date": Date.now()
    }
    const htmlString = `<div>Phonebook has info for ${persons.ength}</div><div>${new Date().toLocaleString()}</div>`
    response.set('Content-Type', 'text/html')
    response.send(Buffer.from(htmlString))
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})