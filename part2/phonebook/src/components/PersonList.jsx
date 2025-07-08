import personService from "../services/personService"

const PersonCard = ({ id, name, number, deletePerson, setError }) => {
  const handleDeleteRequest = () => {
    if(confirm(`Delete ${name}`)) {
      personService.deleteById(id)
        .then(() => {
          deletePerson(id)
        })
        .catch(error => {
          setError(`Information of ${name} has already been deleted from the server`)
          setTimeout(() => setError(null), 5000)
        })
        .then(deletePerson(id))
    }
  }
  
  return (
    <div>
      {name} {number} <button onClick={handleDeleteRequest}>delete</button>
    </div>
  )
}

const PersonList = ({ people, deletePerson, setError }) => {
  return (
    <>
      {people.map(p => 
        <PersonCard key={p.id} id={p.id} name={p.name} number={p.number} 
          deletePerson={deletePerson} setError={setError} />)}
    </>
  )
}

export default PersonList