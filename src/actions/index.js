export const connect = info => ({
  type: 'CONNECT',
  info
});

export const addMessage = message => ({
  type: 'ADD_MESSAGE',
  message
})
