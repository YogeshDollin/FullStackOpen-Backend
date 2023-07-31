require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', (request) => {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.send(person)
    })
})

app.get('/info', (request, response) => {
    Person.find({})
        .then(people => {
            return response.send(`<p>Phonebook has info for ${people.length}</p>
    <p>${Date()}</p>`)
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            if(result) {
                return repsonse.json(result)
            }
            return response.status(404).send(`Person with id ${request.params.id} not available`)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {    
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    let error = false
    let errorMessage
    if(!body.name){
        error = true
        errorMessage = 'name is missing'
    }
    else if(!body.number){
        error = true
        errorMessage = 'number is missing'
    }
    if(error){
        return response.status(400).json({
            error: errorMessage
        })
    }
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save().then(result =>{
        response.json(result)
    })
})

app.put('/api/persons/:id', (request, response) => {
    Person.findByIdAndUpdate(request.params.id, {number: request.number})
        .then(result => {
            return response.json(result)
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Server listening to PORT ', PORT)
})

const errorHandler = (error, request, response, next) => {
    console.log(error);
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)