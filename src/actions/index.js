export const connect = info => ({
  type: 'CONNECT',
  info
});

export const addMessage = message => ({
  type: 'ADD_MESSAGE',
  message
})


/* users */
export const addUsers = users => ({
  type: 'ADD_USERS',
  users
})

export const clearUsers = () => ({
  type: 'CLEAR_USERS'
})

/* messages */
export const addMessages = messages => ({
  type: 'ADD_MESSAGES',
  key: messages.key,
  value: messages.value
})

export const deleteMessages = messages => ({
  type: 'DELETE_MESSAGES',
  key: messages.key
})

export const clearMessages = () => ({
  type: 'CLEAR_MESSAGES'
})

/* settings */
export const initSettings = settings => ({
  type: 'INIT_SETTINGS',
  key: settings.key
})

export const signIn = settings => ({
  type: 'SIGN_IN',
  key: settings.key
})

export const signOut = () => ({
  type: 'SIGN_OUT'
})

export const selectedUser = user => ({
  type: 'SELECTED_USER',
  user
})
