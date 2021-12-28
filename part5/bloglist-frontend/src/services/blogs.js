import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }
  const request = await axios.post(baseUrl, newBlog, config)
  return request.data
}

const update = async updatedBlog => {
  const config = {
    headers: { Authorization: token }
  }
  const request = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, config)
  return request.data
}

export default { getAll, create, setToken, update }