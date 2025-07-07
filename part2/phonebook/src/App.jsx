import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import personService from './services/personService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
  useEffect(() => {
    personService.getAll().then(persons => setPersons(persons))
  }, [])

  const personsToShow = persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter text={filter} setFilter={setFilter} />
      
      <h3>Add a new</h3>
      <PersonForm 
        name={newName} number={newNumber} persons={persons}
        setNewName={setNewName} setNewNumber={setNewNumber} setPersons={setPersons} />

      <h3>Numbers</h3>
      <PersonList people={personsToShow} />
    </div>
  )
}

export default App