import React from 'react'
import { connect } from 'react-redux'
import * as script from '../js/script.js'
import ChatMessageInner from './ChatMessageInner'

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
    if (!props.next || props.next.userId !== props.userId) {
      return false
    }

    const nextTime = script.timestampToTime(props.next.timestamp, true)
    const curTime = script.timestampToTime(props.timestamp, true)

    return (nextTime === curTime)
  }

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

          <ChatMessageInner
            onClickImage={showImageViewer}
            onLoadImage={props.onLoadImage}
            timestamp={props.timestamp}
            message={props.message}
            type={props.type}
          />
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

              <ChatMessageInner
                onClickLink={url=> window.open(url)}
                onClickImage={showImageViewer}
                onLoadImage={props.onLoadImage}
                timestamp={props.timestamp}
                message={props.message}
                type={props.type}
              />
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
