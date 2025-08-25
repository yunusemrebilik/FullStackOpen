let lastNotificationIntervalId = 0

export const notify = (text, setFn) => {
  clearInterval(lastNotificationIntervalId)
  setFn(text)
  lastNotificationIntervalId = setTimeout(() => setFn(''), 5000)
}

const Notification = ({ text }) => {
  if (!text || text === '') {
    return null
  }

  const notificationStyle = {
    border: '2px dashed red',
    padding: 10
  }

  return <div style={notificationStyle}>{text}</div>
}

export default Notification