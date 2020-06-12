import React from 'react';
import * as script from '../js/script.js';

const User = (props) => {
  const className = props.active ? 'chat-user active' : 'chat-user';
  const userInfo = props.data.value;
  const lastMessage = (userInfo && userInfo.lastMessage) ? userInfo.lastMessage : '';
  const dateTime = (userInfo && userInfo.timestamp) ? userInfo.timestamp : null;

  console.log('user', props.data)

  return (
    <div
      className={className}
      onClick={() => {
        props.clickEvent(props.data.key)
      }}>

      <div className="chat-user-icon">
        <div><i className="icon-user" style={{ paddingBottom: 2 }}></i></div>
      </div>
      <div className="chat-user-info">
        <div className="chat-user-name">{ props.data.key }</div>
        <div className="chat-user-detail">
          <div className="chat-user-message">{ lastMessage }</div>
          { dateTime && (
            <>
            <div style={{marginLeft: 5, marginRight: 5, color: '#999'}}>·</div>
            <div className="chat-user-datetime">{ script.getNiceTime(dateTime, new Date(), 1, true) }</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default User
