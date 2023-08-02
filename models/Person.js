const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to ', url);

mongoose.connect(url).then(result => {
    console.log('connected to mongodb');
})
.catch(error => {
    console.log('failed to connect to mongodb. Error: ', error.message);
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                console.log(v);
                console.log('regex testing: ', /(\d{2}-\d{6,})|(\d{3}-\d{5,})/.test(v));
                return /(\d{2}-\d{6,})|(\d{3}-\d{5,})/.test(v)
            },
            message: props => `${props.value} is not valid phone number`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)