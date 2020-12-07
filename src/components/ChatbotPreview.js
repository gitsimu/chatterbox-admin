import React from 'react'
import ChatMessageInner from './ChatMessageInner'
import useScrollTo from '../hooks/useScrollTo'

const ChatbotPreview = ({list, ...props}) => {

  const nickname = props.nickname || 'Manager'
  const [temp, setTemp] = React.useState(true)
  const body = React.useRef(null)
  const [beforeList, setBeforeList] = React.useState([])
  const [current, setCurrent] = React.useState(null)

  const [scrollTo] = useScrollTo(body.current, [beforeList, temp, current])

  React.useEffect(() => {
    refresh()

    setBeforeList([])
    setCurrent(list[0])
  }, [list])

  React.useEffect(() => {
    if(!current) return

    setBeforeList([...beforeList, ...current.questions])
  }, [current])


  const refresh = ()=> {
    setTemp(true)
    setTimeout(()=> setTemp(false))
  }

  return (
    <div
      ref={body}
      className="chat-window-body chatbot-preview"
      style={{
        ...(temp ? {display: 'none'} : {})
      }}>

      {beforeList.map((before, index) => (

        <div
          key={index}>
          {before.my
            ? (
              <div className="message myself">
                <div className="message-inner">{before.message}</div>
              </div>
            )
            : (
              <div
                className="message opponent">
                <div className="message-profile">
                  {(index === 0 || !beforeList[index-1].my) && props.profileImage === null && (
                    <div className="message-profile-icon">
                      {nickname[0]}
                    </div>
                  )}
                  {(index === 0 || beforeList[index-1].my) && props.profileImage !== null && (
                    <div className="message-profile-image">
                      <img src={JSON.parse(props.profileImage).location}
                           alt="message-profile"/>
                    </div>
                  )}
                </div>
                <div className="message-body">
                  <div className="message-top">
                    {(index === 0 || beforeList[index-1].my) && (
                      <div className="message-name">{nickname}</div>
                    )}
                  </div>
                  <div className="message-bottom">
                    <ChatMessageInner
                      message={before.message}
                      type={before.type}
                      onLoadImage={scrollTo}
                      onClickLink={url=> window.open(url)}
                      onClickImage={props.showImageViewer}
                    ></ChatMessageInner>
                  </div>
                </div>
              </div>
            )}
        </div>
      ))}

      {current && (
        <div className="chatbot-buttons">
          {current.answers?.map((answer,index)=> (
            <button
              key={`${current.id}_${index}`}
              onClick={()=> {
                setBeforeList([...beforeList, {my:true, message: answer.message, type: 1}])
                setCurrent(list.find(t=> t.id === answer.to))
              }}
              className="chatbot-button">{answer.message}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


export default ChatbotPreview