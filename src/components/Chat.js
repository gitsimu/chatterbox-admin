import React from 'react'
import ChatMessage from './ChatMessage'
import EmojiContainer from './EmojiContainer'
import axios from 'axios'
import * as firebase from "firebase/app"
import { connect } from 'react-redux'
import { addMessages, initMessages, clearMessages, deleteMessages, selectedUser } from '../actions'
import useUserInput from '../hooks/useUserInput'

const CONNECTIONS = {}
const PAGE_SIZE = 50
const Chat = ({ users, settings, messagesAll, addMessages, initMessages, deleteMessages, clearMessages, selectedUser, ...props }) => {
  const key = settings.key
  const userid = settings.selectedUser.key
  const database = props.database
  const setTabState = props.setTabState
  const target = settings.selectedUser
  const messages = messagesAll[userid]

  const [optionDialog, showOptionDialog] = React.useState(false)
  const [infoDialog, showInfoDialog] = React.useState(false)
  const [emojiContainer, showEmojiContainer] = React.useState(false)
  const [selectedEmoji, selectEmoji] = React.useState(null)
  const [loading, isLoading] = React.useState(false)
  const [fileDropLayer, showFileDropLayer] = React.useState(false)
  const body = React.useRef(null)

  const input = useUserInput(userid)
  let form

  const [scrollTop, setScrollTop] = React.useState(null)

  const scrollToBottom = () => {
    body.current.scrollTop = body.current.scrollHeight
  }

  const paging = React.useCallback((isInit) => {
    if (!userid) return
    if (isInit && CONNECTIONS[userid]) return

    const chat = database.ref(`/${key}/messages/${userid}`).orderByChild('timestamp')
    const page = CONNECTIONS[userid] 
                ? CONNECTIONS[userid].page + 1
                : 1

    Promise.resolve()
      .then(() => isLoading(true))

      // 기존 child_add 이벤트 off
      .then(()=> {
        if (!CONNECTIONS[userid]) return
        CONNECTIONS[userid].ref.off()
      })

      // message list 가져오기
      .then(() => {
        return chat.limitToLast(PAGE_SIZE * page).once('value')
      })

      // store에 저장
      .then((snapshots) => {
        const arr = []
        snapshots.forEach(snapshot => {
          arr.push(snapshot.val())
        })

        initMessages({ key: userid, value: arr })

        const lastMessage = arr[arr.length - 1]
        return lastMessage.timestamp
      })

      // child_add 이벤트 on
      .then((lastTimestamp) => {
        const ref =  chat.startAt(lastTimestamp + 1)
        ref.on('child_added', (snapshot) => {
          const value = snapshot.val()
          addMessages({ key: userid, value: value })
        })

        return ref
      })
      .then((ref) => {
        CONNECTIONS[userid] = { ref: ref, page: page }
        isLoading(false)
      })
  }, [database, key, userid, addMessages, initMessages])

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
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOW_FILE_EXTENSIONS = [
      'jpg', 'jpeg', 'gif', 'bmp', 'png', 'tif', 'tiff', 'tga', 'psd', 'ai', // 이미지
      'mp4', 'm4v', 'avi', 'asf', 'wmv', 'mkv', 'ts', 'mpg', 'mpeg', 'mov', 'flv', 'ogv', // 동영상
      'mp3', 'wav', 'flac', 'tta', 'tak', 'aac', 'wma', 'ogg', 'm4a', // 음성
      'doc', 'docx', 'hwp', 'txt', 'rtf', 'xml', 'pdf', 'wks', 'wps', 'xps', 'md', 'odf', 'odt', 'ods', 'odp', 'csv', 'tsv', 'xls', 'xlsx', 'ppt', 'pptx', 'pages', 'key', 'numbers', 'show', 'ce', // 문서
      'zip', 'gz', 'bz2', 'rar', '7z', 'lzh', 'alz']

    const target = file || e.target.files[0]
    const fileSize = target.size
    const fileExtension = target.name.split('.').pop().toLowerCase()

    if (MAX_FILE_SIZE < fileSize) {
      alert('한 번에 업로드 할 수 있는 최대 파일 크기는 5MB 입니다.')
      return
    } else if (ALLOW_FILE_EXTENSIONS.indexOf(fileExtension) === -1) {
      alert('지원하지 않는 파일 형식입니다.')
      return
    }

    isLoading(true)
    const config = { headers: { 'content-type': 'multipart/form-data' } }
    const formData = new FormData()

    formData.append('file', target)
    formData.append('key', key)

    return axios.post('/api/upload', formData, config)
      .then(res => {
        if (res.data.result === 'success') {
          sendMessage(key, userid, JSON.stringify(res.data.file), 2, database)
        }
      })
      .catch(err => {
        if (err) {
          throw err
        }
      })
      .finally(()=> {isLoading(false)})
  }, [database, key, sendMessage, userid])

  const handleFileInputClear = (e) => {
    e.target.value = ''
  }

  React.useEffect(() => {
    // console.log(selectedEmoji)
    if (input.current && selectedEmoji) {
      input.current.value = input.current.value + selectedEmoji.emoji
    }
  }, [input, selectedEmoji])

  React.useEffect(() => {
    paging(true)

    input.current.focus()
    showInfoDialog((target && target.key === userid) && target.value.state === 2)
    showOptionDialog(false)
    showEmojiContainer(false)
    setScrollTop(null)
  }, [userid, target, paging])


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
      setScrollTop(chatBody.scrollHeight - (chatBody.scrollTop + chatBody.clientHeight))
      // console.log('scroll', chatBody.scrollHeight - (chatBody.scrollTop + chatBody.clientHeight))
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

  // scroll to bottom
  React.useEffect(() => {
    scrollToBottom()
  }, [messages, userid])

  React.useEffect(() => {
    /* Sign out 등의 이유로 Chat 객체를 내릴 때
     * 연결되어있는 firebase connection을 모두 off 처리한다
     */
    return () => {
      clearMessages()
      Object.keys(CONNECTIONS).forEach((u, i) => {
        // console.log('[Connection off]', CONNECTIONS[u])
        if (CONNECTIONS[u]) {
          CONNECTIONS[u].ref.off()
          delete CONNECTIONS[u]
        }
      })
    }
  }, [clearMessages])

  return (
    <>
      <div className='messages card' ref={body}>
        {/* 이전 메세지 (paging) */}
        {CONNECTIONS[userid]
        && messages
        && messages.length >= PAGE_SIZE * CONNECTIONS[userid].page
        && (
          <div className="more-button">
            <div onClick={()=> paging()}>
              <i className="icon-arrow-up"></i>
              이전 메세지
            </div>
          </div>
         )}
        {/* 최하단으로 스크롤 */}
        {messages
        && scrollTop >= 100
        && (
          <div className="scroll-bottom-button" onClick={scrollToBottom} style={{bottom: infoDialog ? 100 : 55}}>
            <div>
              <i className="icon-arrow-down"></i>
            </div>
          </div>
        )}
        {messages && messages.map((m, i) => {
          return <ChatMessage
            opponent={userid}
            target={target}
            key={m.id}
            onloadImage={scrollToBottom}
            prev={messages[i - 1]}
            next={messages[i + 1]}
            {...m}
            {...props}/>
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
            selectEmoji={selectEmoji}/>
        <form ref={node => form = node} onSubmit={e => {
          e.preventDefault()
          if (!input.current.value.trim()) return

          sendMessage(key, userid, input.current.value, 1, database)
          input.current.value = ''
        }}>
          <div className='message-addon'>
            <label>
              <i className='icon-paper-clip'></i>
              <input type='file'
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
              CONNECTIONS[userid].ref.off()
              delete CONNECTIONS[userid]

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
  users: state.users,
  messagesAll: state.messages,
  settings: state.settings
})

const mapDispatchToProps = dispatch => ({
  addMessages: m => dispatch(addMessages(m)),
  initMessages: m=> dispatch(initMessages(m)),
  deleteMessages: m => dispatch(deleteMessages(m)),
  clearMessages: () => dispatch(clearMessages()),
  selectedUser: u => dispatch(selectedUser(u))
})

// export default Chat
export default connect(mapStateToProps, mapDispatchToProps)(Chat)
