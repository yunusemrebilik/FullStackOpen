require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

morgan.token('showPostData', (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
  return ""
})

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.showPostData(req, res)
  ].join(' ')
}))
app.use(express.json())
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => {
      response.status(404).json({
        error: 'person not found'
      })
    })
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`
      <div>
        <p>Phonebook has info for ${persons.length} people</p>
        <div>${new Date()}</div>
      </div>  
    `)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  let id = 0
  let existingPerson = {}
  
  do {
    id = String(Math.floor(Math.random() * 100_000_000))
    existingPerson = persons.find(p => p.id === id)
  } while(existingPerson)

  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing"
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }
 
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT
app.listen(3001, () => {
  console.log(`Server running on port ${PORT}`)
})