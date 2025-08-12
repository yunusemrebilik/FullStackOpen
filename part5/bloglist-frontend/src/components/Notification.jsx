const Notification = ({ content, type }) => {
  const style = {
    padding: '12px',
    border: '4px solid',
    borderRadius: '8px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    backgroundColor: '#fef'
  }
  const successStyle = {
    ...style,
    color: 'green',
    borderColor: 'green'
  }

  const failureStyle = {
    ...style,
    color: 'red',
    borderColor: 'red'
  }

  return (
    <div style={type === 'success' ? successStyle : failureStyle}>
      {content}
    </div>
  )
}

export default Notification