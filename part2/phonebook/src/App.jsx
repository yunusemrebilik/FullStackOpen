import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import personService from './services/personService'
import Success from './components/Success'
import Error from './components/Error'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotificaiton] = useState('')
  const [error, setError] = useState('')
  
  useEffect(() => {
    personService.getAll().then(persons => setPersons(persons))
  }, [])

  const personsToShow = persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  const handleDeletePerson = (id) => {
    setPersons(persons.filter(p => p.id !== id))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Success message={notification} />
      <Error message={error} />

      <Filter text={filter} setFilter={setFilter} />
      
      <h3>Add a new</h3>
      <PersonForm 
        name={newName} number={newNumber} persons={persons}
        setNewName={setNewName} setNewNumber={setNewNumber} setPersons={setPersons} 
        setNotification={setNotificaiton} setError={setError} />

      <h3>Numbers</h3>
      <PersonList 
        people={personsToShow} deletePerson={(id) => handleDeletePerson(id)} setError={setError} />
    </div>
  )
}

export default App