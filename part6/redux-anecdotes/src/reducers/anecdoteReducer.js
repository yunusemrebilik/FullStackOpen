import anecdoteService from '../services/anecdotes'
import { createSlice } from "@reduxjs/toolkit"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setVote(state, action) {
      const id = action.payload.id
      return state.map(a => a.id !== id ? a : {
        ...a,
        votes: action.payload.votes
      })
    },
    newAnecdote(state, action) {
      return [...state, action.payload]
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { newAnecdote, setVote, setAnecdotes } = anecdoteSlice.actions

export const vote = (id) => {
  return async (dispatch, getState) => {
    const { anecdotes } = getState()
    const currentVotes = anecdotes.find(a => a.id === id).votes
    const updatedAnecdote = await anecdoteService.patch(id, 'votes', currentVotes + 1)
    dispatch(setVote({ id, votes: updatedAnecdote.votes }))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const anecdote = await anecdoteService.createNew(content)
    dispatch(newAnecdote(anecdote))
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export default anecdoteSlice.reducer