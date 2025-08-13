import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blog) => {
  const token = `Bearer ${JSON.parse(window.localStorage.getItem('blogsAppUser')).token}`
  const config = {
    headers: { 'Authorization': token }
  }

  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const update = async (id, blog) => {
  const response = await axios.put(`${baseUrl}/${id}`, blog)
  return response.data
}

const remove = async (id) => {
  const token = `Bearer ${JSON.parse(window.localStorage.getItem('blogsAppUser')).token}`
  const config = {
    headers: { 'Authorization': token }
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, remove }