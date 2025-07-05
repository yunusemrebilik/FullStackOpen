import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
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