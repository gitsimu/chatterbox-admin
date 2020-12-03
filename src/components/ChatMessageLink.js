import React from 'react';

const ChatMessageLink = ({message, ...props}) => {
  const {text, url} = JSON.parse(message)

  return (
    <div
      className="message-inner sort-target message-link"
      style={{
        cursor : 'pointer',
      }}
      onClick={()=> { props.onClick && props.onClick(url) }}>
      <span className="message-link-text">
        {text}
        <i className="icon-arrow-right-circle"/>
      </span>
    </div>
  );
}

export default ChatMessageLink