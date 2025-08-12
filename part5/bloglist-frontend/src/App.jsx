import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    const credentials = { username, password }
    try {
      const user = await loginService.login(credentials)
      if (user) {
        setUser(user)
        console.log(user)
      }
    } catch (exception) {
      console.error(exception.message)
    }
  }

  const blogsJSX = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name ?? user.username} logged in</p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor='username'>Username</label>
          <input type='text' id='username' name='username' value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' name='password' value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )

  return (
    <div>      
      {
        !user
        ?
        loginForm()
        :
        blogsJSX()
      }
    </div>
  )
}

export default App