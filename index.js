const express = require('express')
const app = express()
app.use(express.json()) //needed for POST
//3.7 morgan
//When morgan is in used then HTTP verbs will be printed ontu npm console
//Bellow is example what you will see on console, the second row with "GET" word
// Server running on port 3001
// GET / 200 21 - 5.555 ms
const morgan=require('morgan')

morgan.token('type', function (req, res) { return req.headers['content-type'] })
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :type  :body'))

//part3-2
const cors = require('cors')
app.use(cors())
//
let persons = [
        { 
            id: '1',
            name: 'Arto Hellas', 
            number: '040-123456' 
        },
        { 
          id: '2',
          name: 'Ada Lovelace', 
          number: '39-44-5323523' 
        },
        {
          id: '3',
           name: 'Dan Abramov',
            number: '12-43-234345' 
          },
        { 
          id: '4',
          name: 'Mary Poppendieck',
           number: '39-23-6423122' 
          },
        { 
          id: '5',
          name: 'Mark Twen',
          number: '22-55-5522' 
        },
        { 
          id: '6',
          name: 'Backend part3',
          number: '33-33-3333' 
        }
]
const  getFullDate=()=> {
  var dd = new Date(Date.now());
  //console.log('kuku dd',dd)
  var ddStr = dd.toString();
  //console.log("ddStr",ddStr)
  return ddStr
}
const sInfo=()=>{
  let ds=new Date(Date.now()).toLocaleString(`fi-FI`)
  let s= `<p>Phonebook has info for ${persons.length} people</p>`
  s=s.concat('<p>')
  s=s.concat(getFullDate())
  s=s.concat('</>')
  return s
}
 app.get('/', (request, response) => {
   response.send('<h1>Hello World!</h1>')
 })
app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/api/info', (request, response) => {
  console.log('persons',persons.length)
  console.log('sinfo',sInfo())
  response.send(sInfo())
})
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const persona = persons.find(item => Number(item.id) === id)
  
  if (persona) {
    response.json(persona)
  } else {
    response.status(404).end()
  }
})
//POST
app.post('/api/persons', (request, response) => {
  const persona = request.body
  //2.6
  console.log("persona body",persona)
  if (!persona.name|| !persona.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }
  const personaON = persons.find(item => item.name === persona.name)
  if (personaON) {
    return response.status(400).json({ 
      error: 'name already in phonebook' 
    })
  }
  //2.6
  persona.id=Math.floor(Math.random()*1000000)
  console.log("persona with id",persona)
  persons=persons.concat(persona)
  response.json(persona)
})
//DELETE
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  
  persons = persons.filter(item => {
    console.log(item.id, typeof item.id, id, typeof id, Number(item.id) === id)
    Number(item.id) !== id}
  )
  console.log("persons",persons.toString())
  response.status(204).end()
})

const PORT = process.env.PORT || 3001 //3.10
//const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})