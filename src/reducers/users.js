const users = (state = [], action) => {
    console.log('[action]', action)
    switch (action.type) {
      case 'ADD_USERS':
        return [
          ...state,
          action.users
        ]
      case 'CLEAR_USERS':
        return []
      default:
        return state
    }
  }
  
  export default users
  