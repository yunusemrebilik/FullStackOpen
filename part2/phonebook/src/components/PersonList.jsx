import personService from "../services/personService"

const PersonCard = ({ id, name, number, deletePerson }) => {
  const handleDeleteRequest = () => {
    if(confirm(`Delete ${name}`)) {
      personService.deleteById(id).then(() => {
        deletePerson(id)
      })
    }
  }
  
  return (
    <div>
      {name} {number} <button onClick={handleDeleteRequest}>delete</button>
    </div>
  )
}

const PersonList = ({ people, deletePerson }) => {
  return (
    <>
      {people.map(p => <PersonCard key={p.id} id={p.id} name={p.name} number={p.number} deletePerson={deletePerson} />)}
    </>
  )
}

export default PersonList