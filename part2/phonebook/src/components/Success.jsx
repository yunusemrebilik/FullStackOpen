const Success = ({ message }) => {
  if (message === null || message === '') {
    return
  }
  const successStyle = {
    color: 'green',
    fontSize: 16,
    border: '5px solid green',
    borderRadius: 5,
    padding: 5,
    background: 'lightgrey'
  }

  return (
    <div style={successStyle}>
      {message}
    </div>
  )
}

export default Success