import React from 'react';

const URL_PATTERN = /(https?:\/\/)?([ㄱ-힣-a-zA-Z0-9_.]{2,256})\.([a-z]{2,4})\b([-a-zA-Z0-9@:%_+.~#?&/=]*)?/
const ChatMessageText = ({onClick, message, ...props}) => {

  const aLink = text => (
    <a href={text} className="message-url"
         onClick={(event) => {
           let url = !text.startsWith('http')
             ? `https://${text}`
             : text
           event.preventDefault()
           window.open(url, '_blank');
         }}>{text}</a>
  )

  const messageInner = message => {
    if(!URL_PATTERN.test(message)) return message

    const messageArr = []
    let messageText = message
    let matched
    while ((matched = messageText.match(URL_PATTERN))) {
      if (matched.index) messageArr.push(messageText.slice(0, matched.index))

      messageArr.push({ text: matched[0] })
      messageText = messageText.slice(matched.index + matched[0].length)
    }
    if (messageText.length) messageArr.push(messageText)

    return messageArr.map((m, i) => (
      <React.Fragment key={i}>
        {(typeof m === 'object')
          ? aLink(m.text)
          : m
        }
      </React.Fragment>
    ))
  }

  return (
    <div
      style={
        onClick ? {cursor : 'pointer'} : {}
      }
      onClick={() => onClick && onClick()}
      className="message-inner sort-target">

      {messageInner(message)}
    </div>
  )
}

export default ChatMessageText