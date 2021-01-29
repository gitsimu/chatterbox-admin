import React from 'react'
import useEventListener from '../hooks/useEventListener'
import ChatbotTitleIcon from './ChatbotTitleIcon'

const ChatbotAnswer = ({chatbotList, onClickDelete, onClickSave, index, ...props }) => {
  const messageRef = React.useRef()
  const [to, setTo] = React.useState(props.to)
  const [edit, setEdit] = React.useState(false)
  const { onClickOutside, onKeyEscape } = useEventListener()

  React.useEffect(() => {
    if(!edit) return

    const offClick = onClickOutside('.message-edit', ()=> setEdit(false))
    const offEsc = onKeyEscape(()=> setEdit(false))

    return () => {
      offClick()
      offEsc()
    }
  }, [edit])

  React.useEffect(() => {
    if(!edit) return

    setTo(props.to)
    messageRef.current.value = props.message
    messageRef.current.focus()
  }, [edit])

  const toIndex = chatbotList.findIndex(t => t.id === props.to)

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

            {toIndex !== -1
              ? (
                <span className="chatbot-to-title">
                  <ChatbotTitleIcon index={toIndex}/>
                </span>
                )
              : (
                <span className="chatbot-to-title link-off">
                  <img src="/resources/link_off.png"
                       alt=""/>
                </span>
                )
            }

            <div
              className={`chatbot-button sort-target ${toIndex === -1 ? 'invalid' : ''}`}>
              {props.message}
            </div>
          </div>
          <i
            onClick={() => onClickDelete(index)}
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
              onClick={() => {
                onClickDelete(index)
                setEdit(false)
              }}
              style={{
                color : 'red',
                marginLeft : 'auto',
              }}>삭제
            </button>
            <button
              className="edit-button"
              // style={{
              //   marginLeft: 'auto'
              // }}
              onClick={() => {
                const newAnswer = {
                  message: messageRef.current.value,
                  to: to
                }
                onClickSave(index, newAnswer)
                setEdit(false)
              }}>저장
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default React.memo(ChatbotAnswer)