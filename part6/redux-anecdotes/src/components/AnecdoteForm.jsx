import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { notify } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.anecdote.value = ''
    dispatch(createAnecdote(content))

    dispatch(notify(`you added "${content}"`))
  }
  
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
          <input name='anecdote' />
          <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm