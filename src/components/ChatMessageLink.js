import React from 'react';

const ChatMessageLink = ({message, ...props}) => {
  const {text, url} = JSON.parse(message)

  return (
    <div
      className="message-inner message-link sort-target"
      style={{
        cursor : 'pointer'
      }}
      onClick={()=> { props.onClick && props.onClick(url) }}>
      <div>
        {text}
      </div>
    </div>
  );
}

export default ChatMessageLink