const initialstate = ''

const notficationReducer = (state = initialstate, action) => {
  switch(action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export const setNotification = (notification) => {
  return { 
    type: 'SET_NOTIFICATION',
    notification
  }
}

export const clearNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}

export default notficationReducer