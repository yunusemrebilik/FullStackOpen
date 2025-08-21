import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'notification component',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

const lastInverval = { intervalId: 0 }

export const notify = (text, duration = 5) => {
  return async dispatch => {
    clearInterval(lastInverval.intervalId)
    dispatch(setNotification(text))
    lastInverval.intervalId = setTimeout(() => dispatch(clearNotification()), duration * 1000)
  }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer