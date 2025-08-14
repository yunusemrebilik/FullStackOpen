import PropTypes from "prop-types"
import { useState } from "react"

const Blog = ({ blog, handleLike, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [expanded, setExpanded] = useState(false)

  let user = window.localStorage.getItem('blogsAppUser')
  if (user) {
    user = JSON.parse(user)
  }

  const handleRemoveClick = () => {
    if (window.confirm(`Removing blog ${blog.title} by ${blog.author}`)) {
      handleDelete(blog.id)
    }
  }

  const shrunkView = () => (
    <div data-testid="shrunkView">
        {blog.title} by {blog.author}
        <button onClick={() => setExpanded(true)}>view</button>
    </div>
  )

  const expandedView = () => (
    <div data-testid="expandedView">
      <div>
        {blog.title} by {blog.author}
        <button onClick={() => setExpanded(false)}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>{blog.likes} <button onClick={() => handleLike(blog.id)}>like</button></div>
      <div>{blog.user && (blog.user.name ?? blog.user.username)}</div>
      <div>
        {
          blog.user && user && blog.user.username === user.username
          ?
          <button onClick={handleRemoveClick}>remove</button>
          : 
          ''
        }
      </div>
    </div>
  )
  
  return (
    <div style={blogStyle} className="blog">
      {
        expanded
        ?
        expandedView()
        :
        shrunkView()
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  // handleLike: PropTypes.func.isRequired,
  // handleDelete: PropTypes.func.isRequired
}

export default Blog