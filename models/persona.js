const mongoose = require('mongoose')
//3.19
var uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI
//const password='chemodan21'
//const url =  `mongodb+srv://fsp3:${password}@cluster0.mkyfv.mongodb.net/persona-app?retryWrites=true&w=majority`
console.log('you are in persona.js')

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personaSchema = new mongoose.Schema({
  name: {type : String, required: true, minLength:3},
  number: {type : String,required: true}
})

//as 3.19 var mySchema = mongoose.Schema(/* put your schema definition here */);
personaSchema.plugin(uniqueValidator) //3.19

//3.20 update validator on
//const opts = { runValidators: true }
//3.20

personaSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Persona', personaSchema)