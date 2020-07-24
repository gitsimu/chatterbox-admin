import React from 'react'
import { connect } from 'react-redux'
import * as script from '../js/script.js'

const URL_PATTERN = /(https?:\/\/)?([ㄱ-힣-a-zA-Z0-9_.]{2,256})\.([a-z]{2,4})\b([-a-zA-Z0-9@:%_+.~#?&/=]*)?/
const ChatMessage = ({ settings, ...props }) => {
  const isMyself = props.opponent !== props.userId
  const isSameUser = (props.prev && (props.prev.userId === props.userId))
  const showImageViewer = props.showImageViewer

  const skipDate = () => {
    if (!props.prev) {
      return false
    }

    const prevDate = script.timestampToDay(props.prev.timestamp)
    const curDate = script.timestampToDay(props.timestamp)

    return (prevDate === curDate)
  }
  const skipTime = () => {
    if (!props.next) {
      return false
    }

    const nextTime = script.timestampToTime(props.next.timestamp, true)
    const curTime = script.timestampToTime(props.timestamp, true)

    return (nextTime === curTime)
  }

  const getSimpleTextMessage = message => {
    return (
      <div className="message-inner">
        {message}
      </div>
    )
  }
  const getLinkMessage = message => {
    const messageArr = []
    let messageText = message
    let matched
    while ((matched = messageText.match(URL_PATTERN))) {
      if (matched.index) messageArr.push(messageText.slice(0, matched.index))

      messageArr.push({ text: matched[0] })
      messageText = messageText.slice(matched.index + matched[0].length)
    }
    if (messageText.length) messageArr.push(messageText)

    return (
      <div className="message-inner">
        {messageArr.map((m, i) => (
          typeof m === 'object'
            ? <a key={i} href={m.text} className="message-url"
                 onClick={(event) => {
                   let url = !m.text.startsWith('http')
                     ? `https://${m.text}`
                     : m.text
                   event.preventDefault()
                   window.open(url, '_blank');
                 }}>{m.text}</a>
            : m
        ))}
      </div>
    )
  }
  const getTextMessage = message => {
    return URL_PATTERN.test(message)
      ? getLinkMessage(message)
      : getSimpleTextMessage(message)
  }
  const getFileMessage = message => {
    const images = ['jpg', 'png', 'gif', 'jpeg', 'bmp']
    const extension = JSON.parse(message).location.split('.').pop()
    const expired = script.timestampToDay(props.timestamp, 1, 0)

    return (
      <div>
        {(extension && images.indexOf(extension) > -1) && (
          <div
            className="message-thumbnail"
            onClick={() => {
              showImageViewer(JSON.parse(message).location)
            }}>
            <img src={JSON.parse(message).location}
                 onLoad={props.onloadImage}
                 alt="message-thumbnail"/>
          </div>
        )}
        <div className="message-file">
          <div className="message-file-name">{JSON.parse(message).name}</div>
          <div className="message-file-size">파일크기 : {script.bytesToSize(
            JSON.parse(message).size)}</div>
          <div className="message-file-expire">유효기간 : {expired} 까지</div>
          <div
            className="message-file-save"
            onClick={() => {
              setTimeout(() => {
                window.open(JSON.parse(props.message).location)
              }, 100)
            }}>
            저장하기
          </div>
        </div>
      </div>
    )
  }

  const messageInner = props.type === 1
    ? getTextMessage(props.message)
    : getFileMessage(props.message)

  return (
    <>
      {!skipDate() && (
        <div className="message-date">
          <span>{script.timestampToDay(props.timestamp)}</span>
        </div>
      )}

      {(!isSameUser || !skipDate()) && (
        <div className="margin-top-15"></div>
      )}

      { isMyself ? (
        <div className="message myself">
          { !skipTime() && (
            <div className="message-time">{ script.timestampToTime(props.timestamp, true) }</div>
          )}
          { messageInner }
        </div>
      ) : (
        <div className="message opponent">
          <div className="message-profile">
            { (!isSameUser || !skipDate()) && (
              <div className="message-profile-icon"
                style={{ backgroundColor: settings.selectedUser.colorCode }}>
                <div className="bubble"></div>
              </div>
            )}
          </div>
          <div className="message-body">
            { (!isSameUser || !skipDate()) && (
              <div className="message-top">
                <div className="message-name">{ settings.selectedUser.guestCode }</div>
              </div>
            )}
            <div className="message-bottom">
              { messageInner }
              { !skipTime() && (
                <div className="message-time">{ script.timestampToTime(props.timestamp, true) }</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const mapStateToProps = state => ({
  settings: state.settings
})

// export default ChatMessage
export default connect(mapStateToProps)(ChatMessage)
