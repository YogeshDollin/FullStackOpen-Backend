require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/Person')

const argvLength = process.argv.length
// const args = process.argv
// if(argvLength < 3){
//     console.log('give password as argument');
//     process.exit(1)
// }

// const password = args[2]

// const url = `mongodb+srv://mainUser:${password}@cluster0.spqnyh8.mongodb.net/phonebook?retryWrites=true&w=majority`
// mongoose.set('strictQuery', false)
// mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//     name: String,
//     number: String
// })

// const Person = mongoose.model('Person', personSchema)
if(argvLength == 2){
    console.log('phonebook:');
    Person.find({}).then(result => {
        result.forEach( person => {
            console.log(`${person.name} ${person.number}`);
        })
        mongoose.connection.close()
    })
}
// else{
//     const person = new Person({
//         name: args[3],
//         number: args[4]
//     })

//     person.save().then(result => {
//         console.log(`added ${result.name} number ${result.number} to phonebook`);
//         mongoose.connection.close()
//     })
// }