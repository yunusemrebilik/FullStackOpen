import { createContext, useReducer, useContext } from "react";

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET': {
      return action.payload
    }
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => {
  return useContext(NotificationContext)
}

export default NotificationContext