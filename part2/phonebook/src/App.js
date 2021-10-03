import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Filter = ({eventHandler}) => (
  <div>
  filter shown with <input onChange={eventHandler}/>
  </div>
)

const PersonForm = ({formEventHandler, nameEventHandler, numberEventHandler}) => (
  <form onSubmit={formEventHandler}>
    <div>
      name: <input onChange={nameEventHandler} />
    </div>
    <div>
      number: <input onChange={numberEventHandler} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Person = ({persons}) => {
  return (
    <>
    {persons.map(p => 
              <div key={p.name}>
                {p.name} {p.number}
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
    axios
      .get('http://localhost:3001/persons')
      .then(
        response => setPersons(response.data)
      )
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(p => p.name).includes(newName)) {
      window.alert(`${newName} already exists in phonebook.`)
    }
    else {
      const newPerson = {name: newName, number: newNumber}
      setPersons(persons.concat(newPerson))
      console.log(`Added person ${newPerson.name} with number: ${newPerson.number}`)
    }
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
      />
      <h3>Numbers</h3>
      <Person persons={persons.filter(p => p.name.toLowerCase().includes(newNameFilter.toLowerCase()))} />
    </div>
  )
}

export default App
