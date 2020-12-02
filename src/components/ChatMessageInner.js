import React from 'react'
import ChatMessageText from './ChatMessageText'
import ChatMessageSimpleImage from './ChatMessageSimpleImage'
import ChatMessageLink from './ChatMessageLink'
import ChatMessageImage from './ChatMessageImage'

const ChatMessageInner = ({type, onClickText, onClickLink, onClickImage, onLoadImage, message, timestamp, ...props}) => {

  if(type === 1){
    return (
      <ChatMessageText
        onClick={onClickText}
        message={message}
        timestamp={timestamp}
      />
    )
  }

  if(type === 2) {
    return (
      <ChatMessageImage
        onClick={onClickImage}
        onLoadImage={onLoadImage}
        message={message}
        timestamp={timestamp}
      />
  )}

  if(type === 3) {
    return (
      <ChatMessageSimpleImage
        onClick={onClickImage}
        onLoadImage={onLoadImage}
        message={message}
        timestamp={timestamp}
      />
  )}

  if(type === 4) {
    return (
      <ChatMessageLink
        onClick={onClickLink}
        message={message}
        timestamp={timestamp}
      />
  )}
}

export default ChatMessageInner