const users = (state = [], action) => {
    switch (action.type) {
      case 'INIT_USERS':
        return [...action.users]
      case 'ADD_USERS':
        return [
          ...state,
          action.users
        ]
      case 'CLEAR_USERS':
        return []
      case 'CHANGE_USER_STATE':
        const index = state.findIndex(v => v.key === action.key)
        if (index > -1) {
          state[index].state = action.state
        }
        return [...state]
      case 'INIT_USER_STATE':
        state.forEach(v => {
          v.state = ''
        })
        return [...state]
      default:
        return state
    }
  }
  
  export default users
  