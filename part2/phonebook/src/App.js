import React, { useState, useEffect } from 'react'
import personsService from './services/persons'


const Filter = ({eventHandler}) => (
  <div>
  filter shown with <input onChange={eventHandler}/>
  </div>
)

const PersonForm = ({formEventHandler, nameEventHandler, numberEventHandler, nameValue, numberValue}) => (
  <form onSubmit={formEventHandler}>
    <div>
      name: <input value={nameValue} onChange={nameEventHandler} />
    </div>
    <div>
      number: <input value={numberValue} onChange={numberEventHandler} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Person = ({persons, deletePersonHandler}) => {
  return (
    <>
    {persons.map(p => 
              <div key={p.name}>
                {p.name} {p.number}
                <button onClick={() => deletePersonHandler(p.id)}>delete</button>
              </div>
            )
    }
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newNameFilter, setNewNameFilter ] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(
        persons => setPersons(persons)
      )
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(p => p.name).includes(newName)) {
      window.alert(`${newName} already exists in phonebook.`)
    }
    else {
      const newPerson = {name: newName, number: newNumber}
      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')
          console.log(`Added person ${newPerson.name} with number: ${newPerson.number}`)
        })
    }
  }

  const deletePerson = (id) => {
    personsService
      .remove(id)
      .then(() => {
        console.log(`Deleted person with ID ${id} from database.`)
      })
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setNewNameFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter eventHandler={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm formEventHandler={addPerson}
                  nameEventHandler={handleNameChange}
                  numberEventHandler={handleNumberChange}
                  nameValue={newName}
                  numberValue={newNumber}
      />
      <h3>Numbers</h3>
      <Person persons={persons.filter(
                        p => p.name.toLowerCase().includes(newNameFilter.toLowerCase()))
                      }
              deletePersonHandler={deletePerson}
      />

    </div>
  )
}

export default App
