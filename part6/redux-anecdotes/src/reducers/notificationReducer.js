const initialstate = 'This is a default test notification.'

const notficationReducer = (state = initialstate, action) => {
  switch(action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    default:
      return state
  }
}

export const setNotification = (notification) => {
  return { notification }
}

export default notficationReducer