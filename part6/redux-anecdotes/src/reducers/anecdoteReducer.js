import { createSlice } from "@reduxjs/toolkit"

const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload
      return state.map(a => a.id !== id ? a : {
        ...a,
        votes: a.votes + 1
      })
    },
    createAnecdote(state, action) {
      return [...state, {
        content: action.payload,
        id: getId(),
        votes: 0
      }]
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { createAnecdote, vote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer