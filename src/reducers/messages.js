const messages = (state = {}, action) => {
    switch (action.type) {
      case 'INIT_MESSAGES':
        return {
          ...state,
          [action.key] : action.value
        }

      case 'ADD_MESSAGES':
        return {
          ...state,
          [action.key] : [
            ...(state[action.key] || []),
            action.value
          ]
        }
      case 'DELETE_MESSAGES':
        const {[action.key]: deleteTarget, ...newState} = state
        return newState
      case 'CLEAR_MESSAGES':
        return {}
      default:
        return state
    }
  }
  
  export default messages
  