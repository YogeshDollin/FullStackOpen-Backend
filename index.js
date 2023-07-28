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

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.send(person)
    })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length}</p>
    <p>${Date()}</p>`)
})

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find( p => p.id === id)
//     if(person){
//         return response.json(person)
//     }
//     response.status(404).send(`Person with id '${id}' not available`)
// })

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter( p => p.id !== id)
//     response.status(204).end()
// })

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
    // else{
    //     const person = persons.find(p => {return p.name.toLowerCase() === body.name.toLowerCase()})
    //     if(person){
    //         error = true
    //         errorMessage = 'name must be unique'
    //     }
    // }
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Server listening to PORT ', PORT)
})