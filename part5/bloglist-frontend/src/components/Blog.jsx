import { useState } from "react"

const Blog = ({ blog, handleLike }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [expanded, setExpanded] = useState(false)

  const condensedView = () => (
    <div>
        {blog.title} by {blog.author}
        <button onClick={() => setExpanded(true)}>view</button>
    </div>
  )

  const expandedView = () => (
    <div>
      <div>
        {blog.title}
        <button onClick={() => setExpanded(false)}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>{blog.likes} <button onClick={() => handleLike(blog.id)}>like</button></div>
      <div>{blog.author}</div>
    </div>
  )
  
  return (
    <div style={blogStyle}>
      {
        expanded
        ?
        expandedView()
        :
        condensedView()
      }
    </div>
  )
}

export default Blog