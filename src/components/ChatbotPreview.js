import React from 'react'

const ChatbotPreview = ({list, ...props}) => {

  const [temp, setTemp] = React.useState(true)
  const body = React.useRef(null)
  const [beforeList, setBeforeList] = React.useState([])
  const [current, setCurrent] = React.useState(list[0])

  React.useEffect(() => {
    forceRefresh()

    setBeforeList([])
    setCurrent(list[0])
  }, [list])

  React.useEffect(() => {
    setBeforeList([...beforeList, ...current.questions])
  }, [current])

  React.useEffect(() => {
    if(!body.current) return
    body.current.scrollTop = body.current.scrollHeight
  }, [beforeList])

  const forceRefresh = ()=> {
    setTemp(true)
    setTimeout(()=> setTemp(false))
  }

  if(temp) return <></>

  return (
    <div
      ref={body}
      className="chat-window-body chatbot-preview"
      style={{
        overflow:'auto',
        height: '100%'
      }}>

      {beforeList.map((before, index) => (

        <div key={index}>
          {before.my
            ? (
              <div className="message myself">
                <div className="message-inner">{before.message}</div>
              </div>
            ) : (
              <div
                className="message opponent">
                <div className="message-profile">
                  {(index === 0 || !beforeList[index-1].my) && props.profileImage === null && (
                    <div className="message-profile-icon">
                      {props.nickname[0] || 'S'}
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
                      <div className="message-name">Manager3</div>
                    )}
                  </div>
                  <div className="message-bottom">
                    <div className="message-inner">
                      {before.message}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      ))}

      {current && (
        <div style={{
          textAlign: 'right',
          margin: '15px'
        }}>
          {current.answers?.map((answer,index)=> (
            <button
              key={`${current.id}_${index}`}
              onClick={()=> {
                setBeforeList([...beforeList, {my:true, message: answer.message}])
                setCurrent(list.find(t=> t.id === answer.to))
              }}
              className="chatbot-message">{answer.message}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


export default ChatbotPreview