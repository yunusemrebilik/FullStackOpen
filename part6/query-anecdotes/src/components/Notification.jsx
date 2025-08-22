import { useNotificationContext } from "../NotificationContext"

export const notificationInterval = { lastIntervalId: 0 }

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  const notification = useNotificationContext()[0]

  if (!notification || notification === '') {
    return null
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
