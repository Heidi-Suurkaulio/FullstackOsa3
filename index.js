const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())

morgan.token('type', function(request, response) {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }
]

const ln = persons.length
const now = new Date()

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${ln} people</p>
        <p>${now.toString()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    }
    response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

/**
 * Checks whether or not given name already exists
 * @param {string} name 
 * @returns {boolean} true if name already exists, false if name is unique
 */
function isDublicate(name) {
    return persons.some(pe => pe.name === name)
}

/**
 * Random number for id
 * @returns {integer} random number between 0 and 499
 */
function makeRandom() {
    return Math.floor(Math.random() * 500)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.number) {
        return response.status(400).json({
            error: 'no phone number'
        })
    }
    
    if (!body.name) {
        return response.status(400).json({
            error: 'no name'
        })
    }

    if (isDublicate(body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const nPerson = {
        name: body.name,
        number: body.number,
        id: makeRandom()
    }
    persons = persons.concat(nPerson)

    response.json(nPerson)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})