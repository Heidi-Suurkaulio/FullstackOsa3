require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const Persons = require('./models/person')

morgan.token('type', function (request) {
  return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

app.get('/info', (request, response, next) => {
  const now = new Date()
  Persons.countDocuments({}).then(count => {
    response.send(`<p>Phonebook has info for ${count} people</p>
            <p>${now.toString()}</p>`)
  }).catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Persons.find({}).then(pe => {
    response.json(pe)
  }).catch(unknownEndpoint)
})

app.get('/api/persons/:id', (request, response, next) => {
  Persons.findById(request.params.id).then(p => {
    if (p) {
      response.json(p).end()
    } else {
      response.status(404).end()
    }
  }
  ).catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Persons.findByIdAndDelete(request.params.id).then(result => {
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  }
  ).catch(err => next(err))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const nPerson = new Persons({
    name: body.name,
    number: body.number
  })

  nPerson.save().then(sp => response.json(sp)).
    catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  // handles empty put request for some reason...
  Persons.findByIdAndUpdate(request.params.id,
    { number: body.number }, {
      new: true, runValidators: true, context: 'query'
    }).then(p => {
    response.json(p).end()
  }).catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (err, request, response, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (err.name === 'ValidationError') {
    return response.status(403).json({ error: err.message })
  }
  if (err.name === 'DocumentNotFoundError') {
    return response.status(404).send({ err: 'resouce not found' })
  }

  next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
