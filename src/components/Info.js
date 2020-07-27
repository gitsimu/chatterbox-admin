import React from 'react'
import { connect } from 'react-redux'
import * as smlog from '../js/smlog'
import * as script from '../js/script'


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

  const [smlogData, setSmlogData] = React.useState(null)

  React.useEffect(() => {
    setInfo(i)
  }, [props, i])

  React.useEffect(() => {
    if (i.value) {
      setNickname(i.value.nickname || '')
      setMobile(i.value.mobile || '')
      setEmail(i.value.email || '')

      const ip = i.value.ip
      const svid = i.value.svid
      console.log('smlog info', ip, svid)
      
      if (ip && svid) {
        const req = {
          method: 'ip_info_chat',
          ip: ip,
          svid: svid
        }
        smlog.API(req)
          .then((data) => {
            if (data.code === "1") {
              console.log('smlog data', data)
              setSmlogData(data)
            }
          })
          .catch(err => console.log('err', err))
      }
      else {
        setSmlogData(null)
      }
    }
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

  const getLogoUrl = (itype) => {
    let logo = 'https://smlog.co.kr/img/logo/'
    switch(itype) {
      case 'naver':
        logo += 'nv.png'
        break
      case 'google':
        logo += 'gg.png'
        break
      case 'daum':
        logo += 'dm.png'
        break
      case 'nate':
        logo += 'nt.png'
        break
    }
    return logo
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
          {/* <div className="chat-info-item">
            <span>사용자 고유 ID</span>
            <div className="chat-info-item-text">{info.key}</div>
          </div> */}

          {/* smlog data */}
          {smlogData && (
            <>
              <div className="chat-info-item">
                <span>IP</span>
                <div className="chat-info-item-smlog">
                  <img src={`https://smlog.co.kr/img/flag/${smlogData.info.ip_country}`} title={smlogData.info.ip_city_isp}></img>
                  {smlogData.info.ip}
                </div>
              </div>
              <div className="chat-info-item">
                <span>클릭수</span>
                <div className="chat-info-item-smlog">{smlogData.info.ad_click} 회</div>
              </div>
              <div className="chat-info-item">
                <span>체류</span>
                <div className="chat-info-item-smlog">{smlogData.info.sum_vtime}간 체류</div>
              </div>
              {smlogData.ad_history.length > 0 && (
                <div className="ad-click-history">
                  <div className="ad-click-history-title1">광고 클릭 내역</div>
                  <div className="ad-click-history-title2">최근 90일, 유효 클릭만 표시</div>
                  {smlogData.ad_history.map((item, index) => {
                    return (
                    <div className="ad-click-history-list" key={index}>
                      <div className="ad-click-history-date">
                        <div>{script.formatDate(item.art_date)}</div>
                        {item.art_m_pl === '' ? (
                          <div className="ad-click-history-badge ad-click-history-type-pc">PC</div>
                        ) : (
                          <div className="ad-click-history-badge ad-click-history-type-mobile">Mobile</div>
                        )}
                      </div>
                      <div className="ad-click-history-item">
                        <span>광고종류</span>
                        <div>
                          <img src={getLogoUrl(item.itype_img)} style={{height: 10, marginRight: 5}}></img>
                          {item.itype}
                        </div>
                      </div>
                      <div className="ad-click-history-item">
                        <span>체류시간</span>
                        <div>{item.vtime}간 체류</div>
                      </div>
                      <div className="ad-click-history-item">
                        <span>키워드</span>
                        <div>{item.keyword}</div>
                      </div>
                    </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
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
