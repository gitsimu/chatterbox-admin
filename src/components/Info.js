import React from 'react'
import { connect } from 'react-redux'

const Info = ({ users, settings, ...props }) => {
  const key = settings.key
  const database = props.database

  const i = settings.selectedUser
  const [info, setInfo] = React.useState(i)

  const initNickname = (i.value && i.value.nickname) ? i.value.nickname : ''
  const initMobile = (i.value && i.value.mobile) ? i.value.mobile : ''
  const initEmail = (i.value && i.value.email) ? i.value.email : ''

  const [nickname, setNickname] = React.useState(initNickname)
  const [mobile, setMobile] = React.useState(initMobile)
  const [email, setEmail] = React.useState(initEmail)

  React.useEffect(() => {
    setInfo(i)
  }, [props, i])

  React.useEffect(() => {
    setNickname((i.value && i.value.nickname) ? i.value.nickname : '')
    setMobile((i.value && i.value.mobile) ? i.value.mobile : '')
    setEmail((i.value && i.value.email) ? i.value.email : '')
  }, [i])

  const saveInfo = (type) => {
    let data

    switch(type) {
      case 'nickname':
        if (nickname.trim().length === 0) { return }
        else if (nickname.trim().length > 30) {
          alert('닉네임의 허용 길이는 최대 30자 입니다.')
          return
        }

        data = { nickname: nickname.trim() }
        break

      case 'mobile':
        if (mobile.trim().length === 0) { return }
        else if (mobile.trim().length > 30) {
          alert('연락처의 허용 길이는 최대 30자 입니다.')
          return
        }

        data = { mobile: mobile.trim() }
        break

      case 'email':
        if (mobile.trim().length === 0) { return }
        else if (mobile.trim().length > 50) {
          alert('이메일의 허용 길이는 최대 50자 입니다.')
          return
        }

        data = { email: email.trim() }
        break

      default:
        data = null
        break
    }

    if (data) {
      database.ref(`/${key}/users/${settings.selectedUser.key}`).update(data)
      alert('변경되었습니다.')
    }
  }

  return (
    <div className="chat-info card">
      <div className="chat-info-header">사용자 정보</div>
      <div className="chat-info-body">
        {(settings.selectedUser && settings.selectedUser.key) && (
          <>
          <div className="chat-info-item">
            <span>사용자 닉네임</span>
            <div className="chat-info-item-input">
              <input type="text" placeholder="데이터가 없습니다"
                value={nickname}
                onChange={(e) => { setNickname(e.target.value) }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    saveInfo('nickname')
                  }
                }}/>

              {(nickname && nickname !== '') && (
                <div className="chat-info-item-save"
                  onClick={() => { saveInfo('nickname') }}>
                  저장
                </div>
              )}
            </div>
          </div>
          <div className="chat-info-item">
            <span>연락처</span>
            <div className="chat-info-item-input">
              <input type="text" placeholder="데이터가 없습니다"
                value={mobile}
                onChange={(e) => { setMobile(e.target.value) }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    saveInfo('mobile')
                  }
                }}/>

              {(mobile && mobile !== '') && (
                <div className="chat-info-item-save"
                  onClick={() => { saveInfo('mobile') }}>
                  저장
                </div>
              )}
            </div>
          </div>
          <div className="chat-info-item">
            <span>이메일</span>
            <div className="chat-info-item-input">
              <input type="text" placeholder="데이터가 없습니다"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    saveInfo('email')
                  }
                }}/>

              {(email && email !== '') && (
                <div className="chat-info-item-save"
                  onClick={() => { saveInfo('email') }}>
                  저장
                </div>
              )}
            </div>
          </div>
          <div className="chat-info-item">
            <span>사용자 고유 ID</span>
            <div className="chat-info-item-text">{info.key}</div>
          </div>
          </>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  users: state.users,
  settings: state.settings
})

// export default Info
export default connect(mapStateToProps)(Info)
