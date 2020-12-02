import React from 'react'
import useEscapeKey from '../hooks/useEscapeKey'
import useClickOustside from '../hooks/useClickOustside'
import ChatbotTitleIcon from './ChatbotTitleIcon'

const ChatbotAnswer = ({chatbotList, onClickSave, ...props }) => {
  const messageRef = React.useRef()
  const [to, setTo] = React.useState(props.to)
  const [edit, setEdit] = React.useState(false)

  useEscapeKey(() => setEdit(false), edit)
  useClickOustside(() => setEdit(false), '.message-edit', edit)

  React.useEffect(() => {
    if(!edit) return

    setTo(props.to)
    messageRef.current.value = props.message
    messageRef.current.focus()
  }, [edit])

  return (
    <>
      {!edit && (
        <div
          className="flex-row"
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
          <div
            className="flex-row"
            onClick={() => {
              setEdit(true)
            }}
            style={{
              cursor: 'pointer'
            }}>
            <span className="chatbot-to-title">
              {(i => i !== -1
                ? <ChatbotTitleIcon index={i}/>
                : <img src="/resources/link_off.png"
                       alt=""/>)
              (chatbotList.findIndex(t => t.id === props.to))}
            </span>
            <div
              className="chatbot-button sort-target">
              {props.message}
            </div>
          </div>
          <i
            onClick={props.onClickDelete}
            className="close-icon"/>
        </div>
      )}

      {edit && (
        <div className="message-edit">
          <textarea
            ref={messageRef}
            onChange={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = `${e.target.scrollHeight + 12}px`
            }}
          />
          <div className="flex-row">
            <select
              className="chatbot-option"
              value={to}
              onChange={e => setTo(e.target.value)}>
              {!to && (<option value="">선택하세요.</option>)}
              {chatbotList
                .filter(t => t.id !== props.chatbotId)
                .map(t => (<option
                    key={t.id}
                    value={t.id}>{t.title}
                  </option>))}
            </select>
            <button
              className="edit-button"
              style={{
                marginLeft: 'auto'
              }}
              onClick={() => {
                const newAnswer = {
                  message: messageRef.current.value,
                  to: to
                }
                onClickSave(newAnswer)
                setEdit(false)
              }}>저장
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatbotAnswer