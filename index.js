require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const Persons = require('./models/person')

morgan.token('type', function(request, response) {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

const ln = Persons.length
const now = new Date()

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${ln} people</p>
        <p>${now.toString()}</p>`)
})

app.get('/api/persons', (request, response) => {
    Persons.find({}).then(pe => {
        response.json(pe)
      })
})

app.get('/api/persons/:id', (request, response) => {
    Persons.findById(request.params.id).then(p => 
        response.json(p)
    ).catch(err => {
        console.log('id not found', err.message)
        response.status(404).end()
    })
})

//TODO fix
app.delete('/api/persons/:id', (request, response) => {
    Persons.findByIdAndDelete(request.params.id).then(
      response.status(204)  
    ).catch(err => {
        console.log('id not found', err.message)
        response.status(404).end()
    })
/*     const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end() */
})

/**
 * TODO fix
 * Checks whether or not given name already exists
 * @param {string} name 
 * @returns {boolean} true if name already exists, false if name is unique
 */
/* function isDuplicate(name) {
    return persons.some(pe => pe.name === name)
} */

/**
 * TODO remove?
 * Random number for id
 * @returns {integer} random number between 0 and 499
 */
/* function makeRandom() {
    return Math.floor(Math.random() * 500)
} */

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.number) {
        return response.status(400).json({
            error: 'phone number missing'
        })
    }
    
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
//TODO fix
/*     if (isDuplicate(body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } */

    const nPerson = new Persons({
        name: body.name,
        number: body.number
    })

    nPerson.save().then(sp => response.json(sp))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
