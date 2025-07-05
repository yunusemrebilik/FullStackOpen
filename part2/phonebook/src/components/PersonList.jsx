const PersonCard = ({ name, number }) => <div>{name} {number}</div>

const PersonList = ({ people }) => {
  return (
    <>
      {people.map(p => <PersonCard key={p.id} name={p.name} number={p.number} />)}
    </>
  )
}

export default PersonList