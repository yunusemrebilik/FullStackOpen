const Filter = ({ text, setFilter }) => {
  const handleChange = (e) => setFilter(e.target.value)
  
  return <div>filter shown with <input value={text} onChange={handleChange} /></div>
}

export default Filter