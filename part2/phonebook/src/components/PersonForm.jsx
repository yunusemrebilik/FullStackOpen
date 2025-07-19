import personService from "../services/personService"

const PersonForm = ({ name, number, persons, setPersons, setNewName, setNewNumber, setNotification, setError }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    const newPerson = { name: name, number: number }
    console.log(setNotification)

    const existingPerson = persons.find(p => p.name === name)
    if (existingPerson) {
      if(confirm(`${name} is already added to phonebook, replace the old number with a new one?`)) {
        personService.update(existingPerson.id, newPerson)
          .then(responsePerson => {
            setPersons(persons.map(p => p.id === responsePerson.id ? responsePerson : p))
            setNewName('')
            setNewNumber('')
            setNotification(`Updated ${name}`)
            setTimeout(() => setNotification(null), 5000)
          })
          .catch(error => {
            setError(error.response.data.error)
            setTimeout(() => setError(null), 5000)
          })
      }
      return
    }

    personService.create(newPerson)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
        setNotification(`Added ${name}`)
        setTimeout(() => setNotification(null), 5000)
      })
      .catch(error => {
        setError(error.response.data.error)
        setTimeout(() => setError(null), 5000)
      })
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