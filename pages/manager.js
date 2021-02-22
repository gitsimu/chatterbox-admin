import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import FirebaseConfig from '../firebase.config'
import * as firebase from 'firebase/app'
import 'firebase/database'
import ChatbotPreview from '../src/components/ChatbotPreview'

const publicIp = require('public-ip')
const Manager = ({ settings, ...props }) => {

  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig)
  }

  const [managers, setManagers] = React.useState([])
  const [detail, setDetail] = React.useState({})
  const [focusUser, setFocusUser] = React.useState(null)

  const [chatbotManager, setChatbotManager] = React.useState([])
  const [focusChatbotUser, setFocusChatbotUser] = React.useState(null)
  const { current : chatbotListDic } = React.useRef({})
  const [focusChatbotList, setFocusChatbotList] = React.useState([])

  const previewRef = React.useRef(null)

  React.useEffect(() => {
    // simpleline icons
    let simplelineLink = document.createElement("link")
    simplelineLink.href = "https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css"
    simplelineLink.rel = "stylesheet"
    simplelineLink.type = "text/css"
    document.querySelector('body').appendChild(simplelineLink)

    init()

  }, [])

  const init = async ()=> {

    const ip = await publicIp.v4()
    if (ip !== '14.39.40.147') return console.log('허용된 IP가 아닙니다.')

    loadChatbot()
    loadManager()
  }

  const loadChatbot = async ()=>{
    const config = { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
    const formData = new FormData()
    formData.append('method', 'get_chatbot_list')
    const { data : managerList } = await axios.post('https://smlog.co.kr/api/manage.php', formData, config)

    const allP = managerList.map(m=>
      axios.get(`${FirebaseConfig.databaseURL}/${m.chat_id}/config/chatbot/list.json?shallow=true&print=pretty&timeout=5s'`)
        .then(({data})=> (m.count = Object.keys(data).length))
    )

    await Promise.all(allP)
    setChatbotManager(managerList)
  }

  const loadManager = () => {
    Promise.resolve()
      .then(() => {
        const config = { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
        const formData = new FormData()
        formData.append('method', 'get_chat_list')
        return axios.post('https://smlog.co.kr/api/manage.php', formData, config)
      })
      .then(({data}) => {
        setManagers([])
        fetchData(data.data)
      })
      .catch(err => {
        console.error(err)
      })

    const fetchData = async (res) => {
      const arr = []
      for (const m of res) {
        // 중복체크
        if (arr.indexOf(m.chat_id) > -1) {
          continue
        } else {
          arr.push(m.chat_id)
        }

        // https://firebase.google.com/docs/database/rest/retrieve-data?hl=ko#shallow
        await axios.get(`${FirebaseConfig.databaseURL}/${m.chat_id}/messages.json?shallow=true&print=pretty&timeout=5s'`)
          .then(({data}) => {
            if (data) {
              setManagerData({id: m.chat_id, svid: m.svid, messages: data})
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
  }

  const setManagerData = (newData) => {
    setManagers(m => [...m, newData])
  }

  const setDetailData = (id, user, data) => {
    setDetail(m => {
      m[id] = m[id] ? {...m[id], [user]: data} : {[user]: data}
      return {...m}
    })
  }

  const fetchDetailData = async (id, res) => {
    for (const m of res) {
      await axios.get(`${FirebaseConfig.databaseURL}/${id}/messages/${m}.json?shallow=true&print=pretty&timeout=5s'`)
        .then(({data}) => {
          if (data) {
            console.log('detail', data)
            setDetailData(id, m, data)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
  }

  const getChatbotList = async (id) => {
    if(!chatbotListDic[id]){
      chatbotListDic[id] = (await firebase.database().ref(`/${id}/config/chatbot/list`).once('value')).val()
    }

    return chatbotListDic[id]
  }

  const selectChatbotUser = async chatId => {
    if(focusChatbotUser === chatId) {
      setFocusChatbotUser(null)
      return
    }

    const chatbotList = await getChatbotList(chatId)
    setFocusChatbotUser(chatId)
    previewRef.current?.reset()
    setFocusChatbotList([...chatbotList])
  }

  return (
    <div className="managers-container">
      <div>
        <div className="managers thead">
          <div className="managers-no">No.</div>
          <div className="managers-id">채팅 ID</div>
          <div className="managers-svid">SVID</div>
          <div className="managers-message-count">연결된 채팅 수</div>
        </div>
        {managers && managers.map((m, i) => {
          return (
            <React.Fragment key={i}>
              <div className={m.id === focusUser ? "item active" : "item"}>
                <div className="managers" onClick={() => {
                  const focus = focusUser === m.id ? null : m.id
                  setFocusUser(focus)
                  fetchDetailData(m.id, Object.keys(m.messages))
                }}>
                  <div className="managers-no">{i+1}</div>
                  <div className="managers-id">{m.id}</div>
                  <div className="managers-svid">{m.svid}</div>
                  <div className="managers-connection-count">{Object.keys(m.messages).length}</div>
                </div>

                {focusUser === m.id && detail[m.id] && (
                  <div className="user-list">
                    {/* <div className="user thead">
                    <div className="user-no">no.</div>
                    <div className="user-id">대상</div>
                    <div className="user-message-count">메세지 수</div>
                  </div> */}
                    {Object.keys(detail[m.id]).map((d, i) => {
                      const value = detail[m.id][d]
                      return (
                        <div className="user" key={d}>
                          <div className="user-no">-</div>
                          <div className="user-id">{d}</div>
                          <div className="user-message-count">
                            <i className="icon-envelope"></i>
                            <span>{Object.keys(value).length}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                </div>
            </React.Fragment>
          )
        })}
      </div>

      <div>
        <div className="managers thead">
          <div className="managers-no">No.</div>
          <div className="managers-id">채팅 ID</div>
          <div className="managers-svid">SVID</div>
          <div className="managers-message-count">챗봇 개수</div>
          <div className="managers-message-count">챗봇 운영시간</div>
        </div>
        {chatbotManager.map((m, i) => (
          <React.Fragment key={i}>
            <div className={m.chat_id === focusChatbotUser ? "item active" : "item"}>
              <div className="managers" onClick={() => {
                selectChatbotUser(m.chat_id)
              }}>
                <div className="managers-no">{i+1}</div>
                <div className="managers-id">{m.chat_id}</div>
                <div className="managers-svid">{m.sid}</div>
                <div className="managers-svid">{m.count}</div>
                <div className="managers-connection-count">
                  {m.bot_state === '1' && '24시간'}
                  {m.bot_state === '2' && '운영시간'}
                  {m.bot_state === '3' && '비운영시간'}
                </div>
              </div>

              {focusChatbotUser === m.chat_id && (
                <div
                  style={{
                    backgroundColor: '#00000005'
                  }}
                  className="chatterbox-theme-light">

                  <div
                    onClick={()=> previewRef.current.reset()}
                    style={{
                    textAlign : 'center',
                    background : 'white',
                    padding : '7px',
                    cursor : 'pointer',
                  }}>RESET</div>
                  <ChatbotPreview
                    ref={previewRef}
                    profileImage={null}
                    list={focusChatbotList}
                  />
                </div>
              )}
            </div>
          </React.Fragment>
          )
        )}
      </div>
    </div>
  )
}

const getFirebaseAuthToken = async (uuid) => {
  const res = await axios.post('/api/auth', { uuid: uuid })
  return await res
}

const mapStateToProps = state => ({
  settings: state.settings
})

// export default ChatMessage
export default connect(mapStateToProps)(Manager)
