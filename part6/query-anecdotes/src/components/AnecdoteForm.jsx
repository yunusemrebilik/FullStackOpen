import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationContext } from '../NotificationContext'
import { notificationInterval } from './Notification'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationContext()[1]

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      
      clearInterval(notificationInterval.lastIntervalId)
      dispatch({
        type: 'SET',
        payload: `you added "${newAnecdote.content}"`
      })
      notificationInterval.lastIntervalId = setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    },

    onError: (error) => {
      clearInterval(notificationInterval.lastIntervalId)
      dispatch({
        type: 'SET',
        payload: error.response.data.error
      })
      notificationInterval.lastIntervalId = setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
