import React from 'react'
import { connect } from 'react-redux'
import { selectedUser, addMessages, changeUserState } from '../actions'
import * as script from '../js/script.js'

const User = ({ users, messages, settings, addMessages, selectedUser, changeUserState, ...props }) => {
  const userInfo = props.data.value
  const lastMessage = (userInfo && userInfo.lastMessage) ? userInfo.lastMessage : ''
  const dateTime = (userInfo && userInfo.timestamp) ? userInfo.timestamp : null

  const guestCode = props.data.guestCode
  const colorCode = props.data.colorCode
  const state = props.data.state
  const mode = props.mode

  const userClassName = () => {
    let cn = ''
    if (mode === 1) {
      cn = state
    } else if (settings.selectedUser.key === props.data.key) {
      cn = 'active'
    }
    return `chat-user ${cn}`
  }
  
  return (
    <div
      className={userClassName()}
      onClick={() => {
        if (mode === 1) {
          const value = state === '' ? 'selected' : ''
          changeUserState({key: props.data.key, state: value})
        } else {
          selectedUser(props.data)
        }
      }}>

      <div className="chat-user-icon">
        <div style={{ backgroundColor: colorCode }}>
          <div className="bubble"></div>
          <div className={userInfo.live === 1 ? 'live-on' : 'live-off'}></div>
        </div>
      </div>
      <div className="chat-user-info">
        <div className="chat-user-name">{ guestCode }</div>
        <div className="chat-user-detail">
          <div className="chat-user-message">{ lastMessage }</div>
          { dateTime && (
            <>
            <div className="chat-user-datetime">{ script.getNiceTime(dateTime, new Date(), 1, true) }</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  users: state.users,
  messages: state.messages,
  settings: state.settings
})
const mapDispatchToProps = dispatch => ({
  addMessages: m => dispatch(addMessages(m)),
  selectedUser: u => dispatch(selectedUser(u)),  
  changeUserState: u => dispatch(changeUserState(u))
})

// export default User
export default connect(mapStateToProps, mapDispatchToProps)(User)
