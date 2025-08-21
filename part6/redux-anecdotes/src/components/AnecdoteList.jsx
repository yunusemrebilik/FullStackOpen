import { useSelector, useDispatch } from "react-redux"
import { vote } from "../reducers/anecdoteReducer"
import { notify } from "../reducers/notificationReducer"

const Anecdote = ({ anecdote, handleVote }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote.id)}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state => 
    state.anecdotes.filter(a => a.content.includes(state.filter))
    .sort((a, b) => b.votes - a.votes)
  )
  const dispatch = useDispatch()

  const handleVote = (id) => {
    dispatch(vote(id))
    dispatch(notify(`you voted "${anecdotes.find(a => a.id === id).content}"`))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
          <Anecdote key={anecdote.id} anecdote={anecdote} handleVote={handleVote} />
      )}
    </div>
  )
}

export default AnecdoteList