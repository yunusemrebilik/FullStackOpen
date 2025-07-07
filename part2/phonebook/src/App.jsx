import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
  useEffect(() => {
    axios.get('http://localhost:3001/persons').then(response => {
      console.log(response.data)
      setPersons(response.data)
    })
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