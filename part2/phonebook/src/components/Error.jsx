const Error = ({ message }) => {
  if (message === null || message === '') {
    return
  }
  const errorStyle = {
    color: 'red',
    fontSize: 16,
    border: '5px solid red',
    borderRadius: 5,
    padding: 5,
    background: 'lightgrey'
  }

  return (
    <div style={errorStyle}>
      {message}
    </div>
  )
}

export default Error