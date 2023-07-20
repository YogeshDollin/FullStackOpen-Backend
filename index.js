const express = require('express')
const app = express()
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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length}</p>
    <p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find( p => p.id === id)
    if(person){
        return response.json(person)
    }
    response.status(404).send(`Person with id '${id}' not available`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter( p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    let error = false
    let errorMessage
    if(!newPerson.name){
        error = true
        errorMessage = 'name is missing'
    }
    else if(!newPerson.number){
        error = true
        errorMessage = 'number is missing'
    }
    else{
        const person = persons.find(p => {return p.name.toLowerCase() === newPerson.name.toLowerCase()})
        if(person){
            error = true
            errorMessage = 'name must be unique'
        }
    }
    console.log(error)
    console.log(errorMessage);
    console.log(newPerson);
    console.log(persons)
    if(error){
        return response.status(400).json({
            error: errorMessage
        })
    }

    newPerson.id = Math.floor(Math.random() * 100)
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log('Server listening to PORT ', PORT)
})