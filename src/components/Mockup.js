import React from 'react'

const Mockup = (props) => {
  const iconText = (props.nickname && props.nickname.length > 0) ? props.nickname.substring(0, 1) : 'S'

  return (
    <div className="chat-window">
      <div className="header" style={{ backgroundColor: props.themeColor}}>
        { props.profileImage && (
          <div className="header-image">
            <img src={ JSON.parse(props.profileImage).location } alt="header"/>
          </div>
        )}
        <div className="header-title">
          <div className="mainTitle">{props.title}</div>
          <div className="subTitle">{props.subTitle}</div>
        </div>
        <div className="header-close"></div>
      </div>
      <div className="chat-window-body">
        <div className="message opponent">
          <div className="message-profile">
            { props.profileImage === null ? (
              <div className="message-profile-icon">{ iconText }</div>
            ) : (
              <div className="message-profile-image">
                <img src={ JSON.parse(props.profileImage).location } alt="message-profile"/>
              </div>
            )}

          </div>
          <div className="message-body">
            <div className="message-top">
              <div className="message-name">{props.nickname}</div>
            </div>
            <div className="message-bottom">
              <div className="message-inner">{props.firstMessage}</div>
              <div className="message-time">오전 10:57</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mockup
