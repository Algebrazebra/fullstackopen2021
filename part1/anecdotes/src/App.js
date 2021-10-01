import React, { useState } from 'react'

function getRandomInt(min, max) {
  /* Taken from  https://stackoverflow.com/a/1527820 */
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  const initialVotes = new Array(anecdotes.length).fill(0)
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(initialVotes)

  const updateVotes = (votes, selected) => {
    let copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const getMostUpvoted = (votes) => {
    if (votes.length === 0) {
        return -1;
    }
    var max = votes[0];
    var maxIndex = 0;
    for (var i = 1; i < votes.length; i++) {
        if (votes[i] > max) {
            maxIndex = i;
            max = votes[i];
        }
    }
    return maxIndex;
  }

  return (
    <>
      <h1>Anecdote of the day</h1>
      <div>
        {anecdotes[selected]}<br />
        has { votes[selected] } votes
      </div>
      <button onClick={() => updateVotes(votes, selected)}>vote</button>
      <button onClick={() => setSelected(getRandomInt(0, anecdotes.length-1))}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <div>
        {anecdotes[getMostUpvoted(votes)]}<br />
        has { votes[getMostUpvoted(votes)] } votes
      </div>
    </>
  )
}

export default App