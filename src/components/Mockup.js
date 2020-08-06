import React from 'react'

const Mockup = (props) => {
  const iconText = (props.nickname && props.nickname.length > 0) ? props.nickname.substring(0, 1) : 'S'
  let iconStyle = {backgroundColor: props.themeColor}
  switch(props.iconPosition) {
    case 'lt':
      iconStyle = {...iconStyle, top: props.iconAxisY, left: props.iconAxisX}
      break
    case 'rt':
      iconStyle = {...iconStyle, top: props.iconAxisY, right: props.iconAxisX}
      break
    case 'lb':
      iconStyle = {...iconStyle, bottom: props.iconAxisY, left: props.iconAxisX}
      break
    case 'rb':
      iconStyle = {...iconStyle, bottom: props.iconAxisY, right: props.iconAxisX}
      break
    default:
      break
  }


  return (
    <>
    <div className="chat-window">
      <div className="header" style={{backgroundColor: props.themeColor}}>
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

    <div className="chat-screen">
      <div className="chat-icon" style={iconStyle}>
        <img
          style={{width: props.iconSize}}
          src="https://chat.smlog.co.kr/resources/icon_bubble_256.png" alt="chat-icon"/>
      </div>
    </div>
    </>
  )
}

export default Mockup
