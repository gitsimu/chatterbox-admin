import React from 'react';
import useEventListener from '../hooks/useEventListener'
import ChatMessageLink from './ChatMessageLink'

const ChatbotQuestionLink = ({...props}) => {

  const [edit, setEdit] = React.useState(false)
  const messageRef = React.useRef()
  const linkRef = React.useRef()
  const { onClickOutside, onKeyEscape } = useEventListener()

  React.useEffect(() => {
    if(!edit) return

    const offKey = onKeyEscape(()=> setEdit(false))
    const offClick = onClickOutside('.message-edit-link', ()=> setEdit(false))

    return ()=> {
      offClick()
      offKey()
    }
  }, [edit])

  const onClickSave = ()=> {
    const message = JSON.stringify({
      text: messageRef.current.value,
      url: linkRef.current.value
    })

    const newQuestion = {
      message:message,
      type:4
    }

    props.onClickSave(newQuestion)
    setEdit(false)
  }

  React.useEffect(() => {
    if(!edit) return

    const { text, url } = JSON.parse(props.message)
    messageRef.current.value = text
    linkRef.current.value = url

    messageRef.current.style.height = (messageRef.current.scrollHeight + 12) + 'px'
    messageRef.current.focus()
  }, [edit])

  return (
    <>
      {!edit && (
        <ChatMessageLink
          onClick={() => setEdit(true)}
          message={props.message}
        />
      )}

      {edit && (
        <div className="message-edit message-edit-link">
          <div className="link-edit-item">
            <span className="link-edit-title">텍스트</span>
            <div className="link-edit-content">
              <input
                type="text"
                ref={messageRef}/>
            </div>
          </div>

          <div className="link-edit-item">
            <span className="link-edit-title">링크</span>
            <div className="link-edit-content">
              <input
                type="text"
                ref={linkRef}/>
            </div>
          </div>

          <div
            style={{
              alignItems:'center'
            }}
            className="flex-row">

{/*            <label
              className="flex-row"
              style={{
                margin:'0 auto 0 10px',
                fontSize:'13px'
              }}>
              <input
                type="checkbox"/>
              새창열기
            </label>*/}

            <button
              className="edit-button"
              onClick={props.onClickDelete}
              style={{
                color : 'red',
                marginLeft : 'auto',
              }}>삭제
            </button>
            <button
              className="edit-button"
              onClick={onClickSave}
            >저장</button>
          </div>
        </div>
      )
      }
    </>
  );
}


export default ChatbotQuestionLink