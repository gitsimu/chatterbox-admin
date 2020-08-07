import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import FirebaseConfig from '../firebase.config'

const Manager = ({ settings, ...props }) => {
  const [managers, setManagers] = React.useState([])

  React.useEffect(() => {
    Promise.resolve()
      .then(() => {
        setManagers([])
      })
      .then(() => {
        const config = { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
        const formData = new FormData()
        formData.append('method', 'get_chat_list')
        return axios.post('https://smlog.co.kr/api/manage.php', formData, config)
      })
      .then(({data}) => {
        fetchData(data.data)
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
        await axios.get(`${FirebaseConfig.databaseURL}/${m.chat_id}/messages.json?shallow=true&print=pretty'`)
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
  }, [])

  const setManagerData = (newData) => {
    setManagers(m => [...m, newData])
  }

  return (
    <div className="managers-container">
      <div>
        <div className="managers thead">
          <div className="managers-no">No.</div>
          <div className="managers-id">채팅 ID</div>
          <div className="managers-svid">SVID</div>
          <div className="managers-message-count">보낸 메세지 수</div>
        </div>
        {managers && managers.map((m, i) => {
          return (
            <div className="managers" key={i}>
              <div className="managers-no">{i+1}</div>
              <div className="managers-id">{m.id}</div>
              <div className="managers-svid">{m.svid}</div>
              <div className="managers-message-count">{Object.keys(m.messages).length}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  settings: state.settings
})

// export default ChatMessage
export default connect(mapStateToProps)(Manager)
