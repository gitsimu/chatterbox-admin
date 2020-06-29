import { combineReducers } from 'redux'
import info from './info'
import message from './message'
import users from './users'
import messages from './messages'
import settings from './settings'

export default combineReducers({
  info,
  message,
  users,
  messages,
  settings,
})
