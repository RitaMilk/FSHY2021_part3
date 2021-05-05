require('dotenv').config()
//console.log(process.env)
const express = require('express')
const app = express()
app.use(express.json()) //needed for POST
app.use(express.static('build'))
//3.7 morgan
//When morgan is in used then HTTP verbs will be printed ontu npm console
//Bellow is example what you will see on console, the second row with "GET" wordF
// Server running on port 3001
// GET / 200 21 - 5.555 ms
const morgan=require('morgan')

morgan.token('type', function (req, res) { return req.headers['content-type'] })
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :type  :body'))
//
//part3-2
const cors = require('cors')
app.use(cors())
//
//3.19 
//var mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');

//var mySchema = mongoose.Schema(/* put your schema definition here */);
//mySchema.plugin(uniqueValidator);
//3.19
//exctracted model
const Persona = require('./models/persona')
const  getFullDate=()=> {
  var dd = new Date(Date.now());
  //console.log('kuku dd',dd)
  var ddStr = dd.toString();
  //console.log("ddStr",ddStr)
  return ddStr
}
const sInfo=(l)=>{
  let ds=new Date(Date.now()).toLocaleString(`fi-FI`)
  //let s= `<p>Phonebook has info for ${persons.length} people</p>`
  let s= `<p>Phonebook has info for ${l} people</p>`
  //let s= `<p>Phonebook has info for x people</p>`
  s=s.concat('<p>')
  s=s.concat(getFullDate())
  s=s.concat('</>')
  return s
}
const hasEightNumbers=(someStr)=>{
  const ar=someStr.match(/\d/g)
  const c=ar.length
  
  result=c>=8?true:false
  return result
}


// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })
app.get('/api/persons', (request, response) => {
  Persona.find({}).then(personas => {
    response.json(personas)
  })
})
/* app.get('/api/info', (request, response) => {
  console.log('persons',persons.length)
  console.log('sinfo',sInfo())
  response.send(sInfo())
}) */
app.get('/api/info', (request, response) => {
  //console.log('persons',persons.length)
  //console.log('sinfo',sInfo())
  Persona.find({}).then(personas=>
  response.send(sInfo(personas.length))
   )
})
/* app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const persona = persons.find(item => Number(item.id) === id)
  
  if (persona) {
    response.json(persona)
  } else {
    response.status(404).end()
  }
}) */
app.get('/api/persons/:id', function (request, response,next) {
  Persona.findById(request.params.id)
    .then(persona => {
      if (persona) {
        response.json(persona)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
    /* option2  .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' }) */
      //option1 response.status(500).end()
    //})
}) 
//POST
app.post('/api/persons', (request, response,next) => {
  const body = request.body
  //2.6
  console.log("persona body",body)
  if (!body.name|| !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }
  if (!hasEightNumbers(body.number)){
    return response.status(400).json({ 
      error: 'must be 8 numbers' 
    })
  }
    //3.13
  const persona = new Persona({
    name: body.name,
    number: body.number || '0-0',
    id: Math.floor(Math.random()*1000000)
  })
  persona.save()
  .then(savedPersona => {
    if (savedPersona) {
      response.json(savedPersona)
    }
    else{
      return response.status(400).json({ 
        error: 'person name is not unique' 
    })
  }
  })
  .catch(error => next(error))
})
//
//DELETE
/* app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  persons = persons.filter(item => {
    console.log(item.id, typeof item.id, id, typeof id, Number(item.id) === id)
    Number(item.id) !== id}
  )
  console.log("persons",persons.toString())
  response.status(204).end()
}) */

//3.17
app.put('/api/persons/:id', (request, response, next) => {
  const body=request.body
  const persona={
    name : body.name,
    number : body.number
  }
  //const opts = { runValidators: true }
  const opts = { runValidators: true,
                  new: true }
  Persona.findByIdAndUpdate(request.params.id,{number:request.body.number},opts)
  .then(updatedPersona =>{
    if (updatedPersona) {
      response.json(updatedPersona)
    }
    else{
      //response.status(404).end()
      return response.status(400).json({ 
        error: 'person is already deleted' 
      })
    }
  })
  .catch(error => next(error))
})
//3.17 ends
//3.15
app.delete('/api/persons/:id', (request, response, next) => {
  Persona.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
//3.15 ends
//
const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' })
 }

 // handler of requests with unknown endpoint
 app.use(unknownEndpoint) 
//error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' }) 
  } 
  if (error.name === 'ValidationError') {
    //return response.status(400).send({ error: 'not unique name' })
    return response.status(400).send({ error: error.message })
  } 

  next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)
//
const PORT = process.env.PORT || 3001
//const PORT = process.env.PORT || 3001 //3.10
//const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})