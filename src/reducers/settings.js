const initialState = {
    key: '',
    smlogKey: '',
    selectedUser: {},
  };
  
  const settings = (state = initialState, action) => {
    switch (action.type) {
      case 'INIT_SETTINGS':
        return {
          ...state,
          key: action.key,
        }
      case 'SELECTED_USER':
        return {
          ...state,
          selectedUser: action.user,
        };
      case 'SIGN_IN':
        return {
          ...state,
          key: action.key,
        };
      case 'SIGN_OUT':
        return initialState;
      default:
        return state
    }
  }
  
  export default settings
  