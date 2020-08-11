import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import FirebaseConfig from '../firebase.config'

const publicIp = require('public-ip')
const Manager = ({ settings, ...props }) => {
  const [managers, setManagers] = React.useState([])
  const [detail, setDetail] = React.useState({})
  const [focusUser, setFocusUser] = React.useState(null)

  React.useEffect(() => {
    // simpleline icons
    let simplelineLink = document.createElement("link")
    simplelineLink.href = "https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css"
    simplelineLink.rel = "stylesheet"
    simplelineLink.type = "text/css"
    document.querySelector('body').appendChild(simplelineLink)

    Promise.resolve()
      .then(() => {
        return publicIp.v4()
      })
      .then((ip) => {
        if (ip !== '14.39.40.147') {
          throw new Error('허용된 아이피 값이 아닙니다.')
        }
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
              console.log('data', data)
              setManagerData({id: m.chat_id, svid: m.svid, messages: data})
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
  }, [])

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
            <>
            <div className={m.id === focusUser ? "item active" : "item"} key={i}>
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

            {/* <div class="user-list">
              {detail && detail.map((d, i) => {
                if (d.id !== m.id) return
                return (
                  <div className="user" key={d.user}>
                    <div className="user-no">{i+1}</div>
                    <div className="user-id">{d.user}</div>
                    <div className="user-message-count">{Object.keys(d.messages).length}</div>
                  </div>
                )
              })}
            </div> */}
            </>
          )
        })}
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
