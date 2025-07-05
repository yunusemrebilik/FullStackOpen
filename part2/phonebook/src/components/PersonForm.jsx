const PersonForm = ({ name, number, persons, setPersons, setNewName, setNewNumber}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (persons.find(p => p.name === name)) {
      alert(`${name} is already added to phonebook`)
      return
    }
  
    const newPerson = { name: name, number: number, id: persons.length + 1 }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  
  return (
    <form onSubmit={handleSubmit}>
      <div>name: <input value={name} onChange={handleNameChange} /></div>
      <div>number: <input value={number} onChange={handleNumberChange} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm