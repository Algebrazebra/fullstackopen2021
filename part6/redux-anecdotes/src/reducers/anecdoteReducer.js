const anecdoteReducer = (state = [], action) => {
  console.log(state)
  console.log(action)
  switch (action.type) {
    case 'VOTE': {
      const id = action.data.id
      const anecdoteToUpdate = state.find(a => a.id === id)
      const updatedAnecdote = { 
        ...anecdoteToUpdate, 
        votes: anecdoteToUpdate.votes + 1
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : updatedAnecdote 
      )
    }
    case 'CREATE_ANECDOTE':
      return state.concat(action.data)
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    data: { id },
  }
}

export const createAnecdote = (anecdote) => {
  return {
    type: 'CREATE_ANECDOTE',
    data: { ...anecdote },
  }
}

export const initializeAnecdotes = (anecdotes) => {
  return {
    type: 'INIT_ANECDOTES',
    data: anecdotes
  }
}

export default anecdoteReducer