import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (anecdote) => {
  const getId = () => (100000 * Math.random()).toFixed(0)
  const asObject = (anecdote) => {
    return {
      content: anecdote,
      id: getId(),
      votes: 0
    }
  }
  const anecdoteObject = asObject(anecdote)
  const response = await axios.post(baseUrl, anecdoteObject)
  return response.data
}

const incrementVote = async (id) => {
  const anecdoteResponse = await axios.get(`${baseUrl}/${id}`)
  const anecdoteVotes = anecdoteResponse.data.votes
  const response = await axios.patch(`${baseUrl}/${id}`, { votes: anecdoteVotes + 1 })
  return response.status
}

export default { getAll, createNew, incrementVote }