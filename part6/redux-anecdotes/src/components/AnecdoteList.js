import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'


const AnecdoteList = () => {

  const anecdotes = useSelector(state => {
    if ( state.filter !== '') {
      return state.anecdotes.filter(a => a.content.includes(state.filter))
    }
    return state.anecdotes
  })
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(setNotification(`you voted for "${anecdotes.filter(a => a.id === id)[0].content}"`))
    dispatch(voteAnecdote(id))
    setTimeout(() => dispatch(clearNotification()), 5000)
  }

  const compareAnecdotes = (a, b) => {
    return a.votes > b.votes ? -1 : 1
  }

  return (
    <div>
      {anecdotes
        .sort(compareAnecdotes)
        .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList