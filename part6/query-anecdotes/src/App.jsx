import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, voteAnecdote } from './requests'
import { useNotificationContext } from './NotificationContext'
import { notificationInterval } from './components/Notification'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationContext()[1]

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1 // to expedite the simulation of errors
  })

  const voteAnecdoteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (anecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(a => a.id !== anecdote.id ? a : anecdote))

      clearInterval(notificationInterval.lastIntervalId)
      dispatch({
        type: 'SET',
        payload: `you voted "${anecdote.content}" (${anecdote.votes} votes)`
      })
      notificationInterval.lastIntervalId = setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    } 
  })

  const handleVote = (anecdote) => {
    anecdote.votes += 1
    voteAnecdoteMutation.mutate(anecdote)
  }

  if (result.isLoading) {
    return <div>loading...</div>
  }

  if (result.isError) {
    return <div>anecdotes app note avaliable due to unexpected problems in server</div>
  }
  
  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
