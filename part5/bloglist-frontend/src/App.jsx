import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglabe from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState(new Map())
  const newBlogRef = useRef()

  const sortBlogs = () => {
    setBlogs(blogs => {
      return blogs.sort((a, b) => -a.likes + b.likes)
    })
  }
  
  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      sortBlogs()
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('blogsAppUser')
    if (userJSON) {
      setUser(JSON.parse(userJSON))
    } 
  }, [])

  const addNewNotification = (notification) => {
    const id = `${Date.now().toString(36)} ${notification.content}`
    setNotifications(prevNotifications => {
      const newMap = new Map(prevNotifications)
      newMap.set(id, notification)
      return newMap
    })

    setTimeout(() => {
      setNotifications(prevNotifications => {
        const newMap = new Map(prevNotifications)
        newMap.delete(id)
        return newMap
      })
    }, 5000)
  }

  const addNewBlog = async (blog) => {
    try {
      const savedBlog = await blogService.create(blog)
      if (savedBlog) {
        setBlogs(blogs.concat(savedBlog))
        sortBlogs()
        addNewNotification({
          content: `A new blog "${savedBlog.title}" by ${savedBlog.author} has been added`,
          type: 'success'
        })
        newBlogRef.current.toggleVisibility()
        return true
      }
    } catch (exception) {
      addNewNotification({
        content: `An error occured: ${exception.response.data.error}`
      })
      return false
    }
  }

  const handleLike = async (id) => {
    const blog = blogs.find(b => b.id === id)
    if (blog) {
      try {
        blog.likes += 1
        const updatedBlog = await blogService.update(id, blog)
        setBlogs(blogs.map(b => b.id !== id ? b : updatedBlog))
        sortBlogs()
        addNewNotification({
          content: `Blog "${updatedBlog.title}" has been liked (${updatedBlog.likes} likes)`,
          type: 'success'
        })
      } catch (exception) {
        addNewNotification({
          content: `An error occured: ${exception.response.data.error}`
        })
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    const credentials = { username, password }
    try {
      const loggedUser = await loginService.login(credentials)
      if (loggedUser) {
        window.localStorage.setItem('blogsAppUser', JSON.stringify(loggedUser))
        setUser(loggedUser)
        setUsername('')
        setPassword('')
        addNewNotification({
          content: `User "${loggedUser.name ?? loggedUser.username}" successfully logged in`,
          type: 'success'
        })
      }
    } catch (exception) {
      addNewNotification({
        content: `An error occured: ${exception.response.data.error}`
      })
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('blogsAppUser')
    setUser(null)
    addNewNotification({
      content: `User successfully logged out`,
      type: 'success'
    })
  }

  const blogsJSX = () => (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name ?? user.username} logged in
        <button onClick={handleLogout}>log out</button>
      </p>
      <Togglabe buttonLabel='new blog' ref={newBlogRef}>
        <h2>Create new</h2>
        <NewBlogForm addNewBlog={addNewBlog} />
      </Togglabe>
      <div>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} handleLike={handleLike} />)}
      </div>
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

  const notificationsArray = []
  for (let n of notifications.values()) {
    notificationsArray.push(n)
  }

  return (
    <div>      
      <div>
        {notificationsArray.map((n, i) => <Notification key={i} content={n.content} type={n.type} />)}
      </div>
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