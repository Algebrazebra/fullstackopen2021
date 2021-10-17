import React, { useState, useEffect } from 'react'
import personsService from './services/persons'


const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const notifStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div style={notifStyle}>
      {message}
    </div>
  )
}

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
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newNameFilter, setNewNameFilter ] = useState('')
  const [ message, setMessage ] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(
        persons => setPersons(persons)
      )
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (
      persons.map(p => p.name).includes(newName)
      && window.confirm(`${newName} already exists in phonebook. Replace the existing phone number?`)
    ) {
      
      const existingPerson = persons.filter(p => p.name === newName)[0]
      const updatedExistingPerson = {...existingPerson, number: newNumber}
      personsService
        .update(existingPerson.id, updatedExistingPerson)
        .then(returnedPerson => {
          const updatedPersons = persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson)
          setPersons(updatedPersons)
          setNewName('')
          setNewNumber('')
          setMessage(`Updated person ${updatedExistingPerson.name} with new number: ${updatedExistingPerson.number}`)
          setTimeout(() => {setMessage(null)}, 5000)
        })
        .catch(error => {
          setPersons([...persons.filter(p => p.name !== existingPerson.name)])
          setMessage(`Information of ${existingPerson.name} has already been removed from server.`)
          setTimeout(() => {setMessage(null)}, 5000)
        })
    }
    else {
      const newId = Math.max(...persons.map(p => p.id)) + 1
      const newPerson = {name: newName, number: newNumber, id: newId}
      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`Added person ${newPerson.name} with number: ${newPerson.number}`)
          setTimeout(() => {setMessage(null)}, 5000)
        })
        .catch(error => {
          console.log(error.response.data)
          setMessage(error.response.data.error)
          setTimeout(() => {setMessage(null)}, 5000)
        })
    }
  }

  const deletePerson = (id) => {
    if (window.confirm("Are you sure?")) {
      personsService
        .remove(id)
        .then((responseData) => {
          const updatedPersons = [...persons].filter(x => x.id !== id)
          setPersons(updatedPersons)
          console.log(`Deleted person with ID ${id} from database.`)
        })
    } else {
      setMessage(`User cancelled deletion.`)
      setTimeout(() => {setMessage(null)}, 5000)
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setNewNameFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
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
