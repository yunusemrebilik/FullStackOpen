import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'notification component',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    removeNotification() {
      return ''
    }
  }
})

export const lastInverval = {
  intervalId: 0
}

export const { setNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer