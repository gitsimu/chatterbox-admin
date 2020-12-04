import React from 'react'
import useEventListener from '../hooks/useEventListener'
import ChatMessageText from './ChatMessageText'

const ChatbotQuestionText = ({...props}) => {
  const [edit, setEdit] = React.useState(false)
  const messageRef = React.useRef()
  const { onClickOutside, onKeyEscape } = useEventListener()

  React.useEffect(() => {
    if(!edit) return

    const offKey = onKeyEscape(()=> setEdit(false))
    const offClick = onClickOutside('.message-edit', ()=> setEdit(false))

    return ()=> {
      offClick()
      offKey()
    }
  }, [edit])

  const onClickSave = ()=> {
    const message = messageRef.current.value

    const newQuestion = {
      message:message,
      type:1
    }

    props.onClickSave(newQuestion)
    setEdit(false)
  }

  React.useEffect(() => {
    if(!edit) return

    messageRef.current.value = props.message
    messageRef.current.style.height = (messageRef.current.scrollHeight + 12) + 'px'
    messageRef.current.focus()
  }, [edit])

  return (
    <>
      {!edit && (
        <ChatMessageText
          onClick={()=> setEdit(true)}
          message={props.message}
        />
      )}

      {edit && (
        <div className="message-edit">
          <textarea
            ref={messageRef}
            onChange={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = `${e.target.scrollHeight + 12}px`
            }}/>
          <div className="flex-row">
            <button
              className="edit-button"
              onClick={()=> {
                props.onClickDelete()
                setEdit(false)
              }}
              style={{
                color: 'red',
                marginLeft: 'auto'
              }}>삭제
            </button>
            <button
              onClick={onClickSave}
              className="edit-button">저장
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatbotQuestionText