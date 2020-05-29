import React from 'react';

const User = (props) => {
  const className = props.active ? 'chat-user active' : 'chat-user';

  return (
    <div
      className={className}
      onClick={() => {
        props.clickEvent(props.data.key)
      }}>
      { props.data.key }
    </div>
  )
}

export default User
