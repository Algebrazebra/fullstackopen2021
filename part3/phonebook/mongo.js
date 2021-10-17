const mongoose = require('mongoose')

const createPersonModel = (password) => {
  const url =
        `mongodb+srv://user:${password}@cluster0.smkmm.mongodb.net/phonebook-db?retryWrites=true&w=majority`
  mongoose.connect(url)
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  const Person = mongoose.model('Person', personSchema)
  return Person
}

const queryAllPersons = (personModel) => {
  console.log('phonebook:')
  personModel
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}

const addPerson = (personModel, newName, newNumber) => {
  console.log(newName, newNumber)
  const person = new personModel({
    name: newName,
    number: newNumber,
  })
  person
    .save()
    .then(() => {
      console.log(`Added ${newName} ${newNumber} to phonebook.`)
      mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
  const password = process.argv[2]
  const model = createPersonModel(password)
  queryAllPersons(model)
}
else if (process.argv.length === 5) {
  const password = process.argv[2]
  const newName = process.argv[3]
  const newNumber = process.argv[4]
  const model = createPersonModel(password)
  addPerson(model, newName, newNumber)
} else {
  console.log('Invalid argument(s).')
  process.exit(1)
}
