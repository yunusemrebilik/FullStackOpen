import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { lastInverval, removeNotification, setNotification } from "../reducers/notificationReducer"
import anecdoteService from "../services/anecdotes"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.anecdote.value = ''
    const anecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(anecdote))

    clearInterval(lastInverval.intervalId)
    dispatch(setNotification(`you added "${content}"`))
    lastInverval.intervalId = setTimeout(() => dispatch(removeNotification()), 5000)
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