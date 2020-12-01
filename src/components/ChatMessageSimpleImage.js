import React from 'react'

const ChatMessageSimpleImage = ({onLoadImage, message, ...props}) => {
  const {location} = JSON.parse(message)
  const images = ['jpg', 'png', 'gif', 'jpeg', 'bmp']
  const extension = location.split('.').pop()

  return (
    <div className="sort-target">
      {(extension && images.indexOf(extension) > -1) && (
        <div
          className="message-thumbnail simple-thumbnail"
          onClick={() => {
            props.onClick && props.onClick(location)
          }}>
          <img src={location}
               onLoad={onLoadImage}
               alt="message-thumbnail"/>
        </div>
      )}
    </div>
  );
}

export default ChatMessageSimpleImage