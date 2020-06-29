const messages = (state = {}, action) => {
    switch (action.type) {
      case 'ADD_MESSAGES':
        const o = {};
        o[action.key] = state[action.key] ?
                        [...state[action.key], action.value] :
                        [action.value];
  
        return Object.assign(state, o);
      case 'DELETE_MESSAGES':
        delete state[action.key];
        return state
      case 'CLEAR_MESSAGES':
        return {}
      default:
        return state
    }
  }
  
  export default messages
  