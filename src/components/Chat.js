import React from 'react'
import ChatMessage from './ChatMessage'
import EmojiContainer from './EmojiContainer'
import * as firebase from 'firebase/app'
import { connect } from 'react-redux'
import { addMessages, clearMessages, deleteMessages, initMessages, pagingMessages, selectedUser } from '../actions'
import useUserInput from '../hooks/useUserInput'
import useScrollTo from '../hooks/useScrollTo'
import useMessageGetter from '../hooks/useMessageGetter'
import useImageUpload from '../hooks/useImageUpload'
import useImageFile from '../hooks/useImageFile'
import PreviewContainer from './PreviewContainer'

const PAGE_SIZE = 50
const Chat = ({ settings, messages, addMessages, pagingMessages, initMessages, deleteMessages, clearMessages, selectedUser, ...props }) => {
  const key = settings.key
  const userid = settings.selectedUser.key
  const database = props.database
  const setTabState = props.setTabState
  const target = settings.selectedUser

  const [optionDialog, showOptionDialog] = React.useState(false)
  const [infoDialog, showInfoDialog] = React.useState(false)
  const [emojiContainer, showEmojiContainer] = React.useState(false)
  const [loading, isLoading] = React.useState(false)
  const [fileDropLayer, showFileDropLayer] = React.useState(false)
  const body = React.useRef(null)
  const [hasScrollToBottom, setHasScrollToBottom] = React.useState(false)
  const [scrollTo, setScrollToBottom, setScrollToFix] = useScrollTo(body.current, [messages, userid])
  const [getMessageByDB, onAddedMessage, hasBeforeMessage, listenerOff] = useMessageGetter(database, userid)
  const [imageSrc, imageFile, setImageFile] = useImageFile()
  const input = useUserInput(userid)
  const [uploadImage] = useImageUpload()
  let form

  const sendMessage = React.useCallback((key, id, message, type, database) => {
    const timestamp = firebase.database.ServerValue.TIMESTAMP
    const messageId = Math.random().toString(36).substr(2, 9)
    const lastMessage = (type === 2) ? JSON.parse(message).name : message.trim()

    database.ref(`/${key}/users/${id}`).update({
      state:1,
      lastMessage: lastMessage,
      timestamp: timestamp
    })
    database.ref(`/${key}/messages/${id}/${messageId}`).update({
      id: messageId,
      userId: key,
      message: message.trim(),
      type: type,
      timestamp: timestamp
    })
    setTabState(1)
    showInfoDialog(false)
  }, [setTabState])

  const handleEmojiContainer = () => {
    showEmojiContainer(!emojiContainer)
  }

  const handleFileInput = React.useCallback((e, file) => {

    const target = file || e.target.files[0]

    return Promise.resolve()
      .then(()=> isLoading(true))
      .then(()=> uploadImage(target))
      .then(res => {
        sendMessage(key, userid, JSON.stringify(res.data.file), 2, database)
      })
      .catch(({ message }) => message && alert(message))
      .finally(()=> isLoading(false))

  }, [database, key, sendMessage, userid])

  const handleFileInputClear = (e) => {
    e.target.value = ''
  }

  const addBeforeMessage = (timestamp)=> {
    isLoading(true)

    return getMessageByDB(PAGE_SIZE, timestamp)
      .then(beforeMessageList => {
        pagingMessages({key: userid, value:beforeMessageList})
        isLoading(false)

        return beforeMessageList
      })
  }

  const onMessageListener = React.useCallback((startTimestamp)=> {
    onAddedMessage(startTimestamp, (addedMessage) => {
      setScrollToBottom()
      addMessages({ key: userid, value: addedMessage })
    })
  }, [userid])

  const handleEmojiInput = React.useCallback((emoji)=>{
    input.current.value += emoji.emoji
    input.current.focus()
  }, [input])

  React.useEffect(() => {
    input.current.focus()
    showInfoDialog((target && target.key === userid) && target.value.state === 2)
    showOptionDialog(false)
    showEmojiContainer(false)
    setHasScrollToBottom(false)
    setImageFile(null)
    setScrollToBottom()

    if (!messages || messages.length === 0) {
      addBeforeMessage(+new Date())
        .then((list)=> {
          onMessageListener(list[list.length - 1].timestamp)
        })
    }
  }, [userid, target])

  React.useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleDragEnter = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.dataTransfer && e.dataTransfer.types[0] === 'Files') {
        showFileDropLayer(true)
      }
    }

    const handleDragLeave = (e) => {
      e.preventDefault()
      e.stopPropagation()
      showFileDropLayer(false)
    }

    const handleDrop = (e) => {
      e.preventDefault()
      e.stopPropagation()

      showFileDropLayer(false)
      for (let f of e.dataTransfer.files) {
        handleFileInput(e, f)
      }
    }

    const handleScroll = (e) => {
      const chatBody = body.current

      const scrollTop = chatBody.scrollHeight - (chatBody.scrollTop + chatBody.clientHeight)
      setHasScrollToBottom(scrollTop >= 100)
    }

    /* 파일 드래그&드랍 지원 이벤트, 스크롤 이벤트
     * dragover
     * dragenter
     * dragleave
     * drop
     */
    if (key) {
      const chatBody = body.current

      /* 이벤트 할당 */
      chatBody.addEventListener('dragenter', handleDragEnter)
      document.getElementById('file-drop-layer').addEventListener('dragover', handleDragOver)
      document.getElementById('file-drop-layer').addEventListener('dragleave', handleDragLeave)
      document.getElementById('file-drop-layer').addEventListener('drop', handleDrop)
      chatBody.addEventListener('scroll', handleScroll)

      /* 이벤트 해제 */
      return () => {
        chatBody.removeEventListener('dragenter', handleDragEnter)
        document.getElementById('file-drop-layer').removeEventListener('dragover', handleDragOver)
        document.getElementById('file-drop-layer').removeEventListener('dragleave', handleDragLeave)
        document.getElementById('file-drop-layer').removeEventListener('drop', handleDrop)
        chatBody.removeEventListener('scroll', handleScroll)
      }
    }
  }, [key, handleFileInput])

  React.useEffect(() => {
    /* Sign out 등의 이유로 Chat 객체를 내릴 때
     * 연결되어있는 firebase connection을 모두 off 처리한다
     */
    return () => {
      selectedUser({})
      clearMessages()
      listenerOff()
    }
  }, [])

  return (
    <>
      <div className='messages card' ref={body}>
        {/* 이전 메세지 (paging) */}
        {hasBeforeMessage && (
          <div className="more-button">
            <div onClick={()=> {
              setScrollToFix()
              addBeforeMessage(messages[0].timestamp)
            }}>
              <i className="icon-arrow-up"></i>
              이전 메세지
            </div>
          </div>
         )}
        {/* 최하단으로 스크롤 */}
        {messages
         && hasScrollToBottom
         && (
          <div
            className="scroll-bottom-button"
            onClick={()=> {
              setScrollToBottom()
              scrollTo()
            }}
            style={{bottom: infoDialog ? 100 : 55}}>
            <div>
              <i className="icon-arrow-down"></i>
            </div>
          </div>
        )}
        {messages && messages.map((m, i) => {
          return <ChatMessage
            key={m.id}
            opponent={userid}
            target={target}
            onLoadImage={scrollTo}
            prev={messages[i - 1]}
            next={messages[i + 1]}
            showImageViewer={props.showImageViewer}
            {...m}
          />
          })
        }
        <div id='file-drop-layer' className={ fileDropLayer ? 'file-drop-layer active' : 'file-drop-layer' }>
          <div>
            <i className='icon-cloud-upload'></i>
            <div>여기에 파일을 드래그하면</div>
            <div>바로 업로드됩니다.</div>
          </div>
        </div>
      </div>
      <div className='message-form'>
        <EmojiContainer
            getState={emojiContainer}
            setState={showEmojiContainer}
            selectEmoji={handleEmojiInput}/>
        <PreviewContainer
          image={imageSrc}/>
        <form
          ref={node => form = node}
          onSubmit={e => {
            e.preventDefault()

            if (imageFile) {
              handleFileInput(null, imageFile)
                .then(()=> setImageFile(null))
            }

            if (input.current.value.trim()) {
              sendMessage(key, userid, input.current.value, 1, database)
              input.current.value = ''
            }
          }}>
          <div className='message-addon'>
            <label>
              <i className='icon-paper-clip'></i>
              <input type='file'
                accept="image/*"
                onClick={e => handleFileInputClear(e)}
                onChange={e => handleFileInput(e)}/>
            </label>
            <label>
              <i className='icon-emotsmile'
                 onClick={e => handleEmojiContainer(e)}></i>
            </label>
          </div>
          <textarea
            ref={input}
            className='message-input'
            placeholder='메세지를 입력해주세요.'
            onBlur={() => setImageFile(null)}
            onPaste={(e) => {
              let item = e.clipboardData.items[0]
              if (!item || !item.type || item.type.indexOf('image') !== 0) return

              setImageFile(item.getAsFile())
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && imageFile) {
                setImageFile(null)
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                form.dispatchEvent(new Event('submit'))
              }
            }}/>
          <button className='message-button-send' type='submit'>
            <i className='icon-paper-plane'></i>
          </button>
          <div className='message-button-more'
            onClick={() => {
              showOptionDialog(!optionDialog)
            }}>
            <i className='icon-options-vertical'></i>
          </div>
        </form>

        <div className={optionDialog ? 'message-option-dialog' : 'message-option-dialog hide'}>
          {target.value.state !== 2 && (
            <div className='message-option-complete'
              onClick={() => {
                database.ref(`/${key}/users/${userid}`).update({ state: 2 })
                // setTabState(2)
                showOptionDialog(false)
                showInfoDialog(true)
                alert('이 대화가 종료처리 되었습니다.')
              }}>
              <i className='icon-power'></i>대화 종료하기
            </div>
          )}
          <div className='message-option-delete'
            onClick={() => {
              /* firebase */
              database.ref(`/${key}/messages/${userid}`).remove()
              database.ref(`/${key}/users/${userid}`).remove()
              /* redux store */
              deleteMessages({ key: userid })
              selectedUser({})
              /* connections */
              listenerOff(userid)

              alert('이 대화가 삭제처리 되었습니다.')
            }}>
            <i className='icon-trash'></i>대화 삭제하기
          </div>
        </div>

        { infoDialog && (
          <div className='dialog info'>
            {/* <div className='dialog-header'>
              <i className='icon-exclamation'></i>
              <span>Infomation</span>
            </div> */}
            <div className='dialog-body'>
              <div>이 대화는 이미 종료된 대화입니다.</div>
              <div>메세지를 보내면 다시 활성화됩니다.</div>
            </div>
          </div>
        )}
      </div>

      { loading && (
        <div id='loading'><div></div></div>
      )}
    </>
  )
}

const mapStateToProps = state => ({
  messages: state.messages[state.settings.selectedUser.key],
  settings: state.settings
})

const mapDispatchToProps = dispatch => ({
  pagingMessages : m=> dispatch(pagingMessages(m)),
  addMessages: m => dispatch(addMessages(m)),
  initMessages: m=> dispatch(initMessages(m)),
  deleteMessages: m => dispatch(deleteMessages(m)),
  clearMessages: () => dispatch(clearMessages()),
  selectedUser: u => dispatch(selectedUser(u))
})

// export default Chat
export default connect(mapStateToProps, mapDispatchToProps)(Chat)
