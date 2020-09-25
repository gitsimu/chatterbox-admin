import React from 'react'
import { connect } from 'react-redux'
import * as smlog from '../js/smlog'
import * as script from '../js/script'

const Info = ({ users, settings, ...props }) => {
  const key = settings.key
  const database = props.database
  const i = settings.selectedUser
  const [nickname, setNickname] = React.useState('')
  const [mobile, setMobile] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [smlogData, setSmlogData] = React.useState(null)
  const [chatHistory, setChatHistory] = React.useState([])
  const [activeChatHistory, setActiveChatHistory] = React.useState(false)
  
  const setTabState = props.setTabState
  const selectedUser = props.selectedUser

  React.useEffect(() => {
    if (i.value) {
      setNickname(i.value.nickname || i.guestCode)
      setMobile(i.value.mobile || '')
      setEmail(i.value.email || '')

      const ip = i.value.ip
      const svid = i.value.svid
      // console.log('smlog info', ip, svid)

      if (ip && svid) {
        const req = {
          method: 'ip_info_chat',
          ip: ip,
          svid: svid
        }
        smlog.API(req)
          .then((data) => {
            if (data && data.code === "1") {
              // console.log('smlog data', data)
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

  React.useEffect(() => {
    if (i.value) {      
      const 
        ip = i.value.ip,
        ck = i.value.ck,
        muid = i.value.muid

      // Chat history
      setChatHistory(users.filter(u => {
        return (muid === '') ? 
          (u.value.ck === ck || u.value.ip === ip) :      // pc
          (u.value.ck === ck || u.value.muid === muid)    // mobile
      }))      
    }
  }, [i, users])

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
      case 'google':
        logo += 'gg.png'
        break
      case 'daum':
        logo += 'dm.png'
        break
      case 'nate':
        logo += 'nt.png'
        break
      case 'naver':      
        logo += 'nv.png'
        break
      default:
        logo = undefined
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
          {i.value.member_id && (
            <div className="chat-info-item">
              <span>회원 아이디</span>
              <div className="chat-info-item-smlog">           
                {i.value.member_id}
              </div>
            </div>
          )}
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
              {/* IP / Device */}
              {i.value.muid === '' ? (  
                <div className="chat-info-item">
                  <span>IP</span>
                  <div className="chat-info-item-smlog">
                    <img 
                      src={`https://smlog.co.kr/img/flag/${smlogData.info.ip_country}`}
                      title={smlogData.info.ip_city_isp} alt=""
                    />
                    {smlogData.info.ip}
                  </div>
                </div>
              ) : (
                <div className="chat-info-item">
                  <span>단말기 세션</span>
                  <div className="chat-info-item-smlog">
                    {i.value.muid}
                  </div>
                </div>
              )}
              {/* 총 클릭수 */}
              <div className="chat-info-item">
                <span>클릭수</span>
                <div className="chat-info-item-smlog">{smlogData.info.ad_click} 회</div>
              </div>
              {/* 총 체류시간 */}
              <div className="chat-info-item">
                <span>체류</span>
                <div className="chat-info-item-smlog">{smlogData.info.sum_vtime} 체류</div>
              </div>
              {/* 상태 */}
              {(smlogData.info.state !== '' || smlogData.info.state_naver_ban_ip === '1') && (
                <div className="chat-info-item">
                  <span>상태</span>
                  <div className="chat-info-item-smlog" style={{display: 'block'}}>
                  {smlogData.info.state === 'blocked_ip_1' && (
                    <div className="ad-click-history-badge ad-click-history-state" style={{backgroundColor: '#ff2a27'}}>차단 IP</div>
                  )}
                  {smlogData.info.state === 'blocked_ip_2' && (
                    <div className="ad-click-history-badge ad-click-history-state" style={{backgroundColor: '#333'}}>블랙리스트</div>
                  )}
                  {smlogData.info.state_naver_ban_ip === '1' && (
                    <div className="ad-click-history-badge ad-click-history-state" style={{backgroundColor: '#19ce60'}}>네이버 노출제한</div>
                  )}
                  </div>
                </div>
              )}
              {/* 대화 내역 */}
              {chatHistory && chatHistory.length > 1 && (
                <>
                <div className="chat-info-item" style={{cursor: 'pointer'}} onClick={() => {setActiveChatHistory(!activeChatHistory)}}>
                  <span>대화 내역</span>
                  <div className="chat-info-item-smlog">{chatHistory.length} 건</div>
                  <div className={activeChatHistory ? "arrowup" : "arrowdown"}></div>
                </div>
                {activeChatHistory && (
                  <div className="chat-history">
                    {/* <div className="chat-history-title">대화 내역 {`(${chatHistory.length})`}</div> */}
                    <div className="chat-history-list">
                    {chatHistory.map((item, index) => {
                      const state = ['대기', '진행 중', '종료']
                      const userState = item.value.state ? item.value.state : 0

                      return (                      
                        <div className="chat-user" key={`${item.key}-history`}
                          onClick={() => {
                            setTabState(userState)
                            selectedUser(item)
                          }}>
                          <div className="chat-user-icon">
                            <div style={{backgroundColor: item.colorCode}}>
                              <div className="bubble"></div>
                            </div>
                          </div>
                          <div className="chat-user-info">
                            <div className="chat-user-name">
                              <div style={{flex: 1}}>{item.guestCode}</div>
                              <div style={{marginRight: 5}}>{state[userState]}</div>
                            </div>
                            <div className="chat-user-detail">
                              <div className="chat-user-message">{item.value.lastMessage}</div>
                              <div className="chat-user-datetime">{script.getNiceTime(item.value.timestamp, new Date(), 1, true)}</div>
                            </div>
                          </div>
                        </div>                      
                      )
                    })}                  
                    </div>                 
                  </div>
                )}                
                </>
              )}
              {/* 광고 클릭 내역 */}
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
                          {getLogoUrl(item.itype_img) && (
                            <img src={getLogoUrl(item.itype_img)} style={{height: 10, marginRight: 5}} alt=""></img>
                          )}
                          {item.itype}
                        </div>
                      </div>
                      <div className="ad-click-history-item">
                        <span>체류시간</span>
                        <div>{item.vtime} 체류</div>
                      </div>
                      <div className="ad-click-history-item">
                        <span>키워드</span>
                        <div>{item.keyword || '-'}</div>
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
