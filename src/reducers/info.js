const initialState = {
  key: '',
  id: '',
  connected: false,
  isLoading: false,
};

const info = (state = [], action) => {
  console.log('[action]:', action);
  switch (action.type) {
    case 'CONNECT':
      return {
        ...state,
        key: action.key,
        id: action.id,
        connected: true,
        isLoading: false,
      };
    default:
      return state
  }
}

export default info
