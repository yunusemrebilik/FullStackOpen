import { useDispatch } from "react-redux"
import { newAnectode } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    const content = e.target.anectode.value
    e.target.anectode.value = ''
    dispatch(newAnectode(content))
  }
  
  return (
    <form onSubmit={handleSubmit}>
        <div><input name='anectode' /></div>
        <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm