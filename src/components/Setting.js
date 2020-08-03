import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Mockup from './Mockup'
import { ChromePicker } from 'react-color'
import * as smlog from '../js/smlog'

const initWorkingDay = {
  isInit: true,
  use: false, 
  week: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'], 
  allday: true,
  startWork: '0000', 
  endWork: '0000',
  breaktime: false,
  startBreak: '0000',
  endBreak: '0000',
  message: '',
}
const initConfig = {
  title: '채팅 상담',
  subTitle: '보통 몇 분 내에 응답합니다',
  nickname: 'Manager',
  firstMessage: '방문해주셔서 감사합니다.\n궁금한 내용을 편하게 남겨주세요.',
  themeColor: '#444c5d'
}  

const Setting = ({ settings, ...props }) => {
  const database = props.database

  const [title, setTitle] = React.useState('')
  const [subTitle, setSubTitle] = React.useState('')
  const [nickname, setNickname] = React.useState('')
  const [firstMessage, setFirstMessage] = React.useState('')
  const [profileImage, setProfileImage] = React.useState(null)
  const [themeColor, setThemeColor] = React.useState('#444c5d')
  const [themeColorPicker, showThemeColorPicker] = React.useState(false)
  
  const [useChat, setUseChat] = React.useState(true)
  const [workingDay, setWorkingDay] = React.useState(initWorkingDay)
  const [missedMessage, setMissedMessage] = React.useState('')
  const [settingMenuState, setSettingMenuState] = React.useState(0)
  const isLoading = props.isLoading
  
  React.useEffect(() => {
    /* by firebase */
    database.ref(`/${settings.key}/config`).once('value', function(snapshot) {
      const data = snapshot.val()
      if (data) {
        setTitle(data.title)
        setSubTitle(data.subTitle)
        setNickname(data.nickname)
        setFirstMessage(data.firstMessage)
        setThemeColor(data.themeColor)
        setProfileImage(data.profileImage || null)
        setWorkingDay(data.workingDay || initWorkingDay)
        setMissedMessage(data.workingDay.message)
      } else {
        setTitle(initConfig.title)
        setSubTitle(initConfig.subTitle)
        setNickname(initConfig.nickname)
        setFirstMessage(initConfig.firstMessage)
      }   
    })

    /* use chat */
    smlog.API({
      method: 'get_chat_state',
      svid: props.svid
    }).then(({code, use_chat}) => {
      code === "1" && setUseChat(use_chat === "1")
    })
  }, [database, settings.key])

  /* file upload handler */
  const handleFileInput = (e) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOW_FILE_EXTENSIONS = ['jpg', 'jpeg', 'gif', 'bmp', 'png']

    const target = e.target.files[0]
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
    formData.append('key', settings.key)

    return axios.post('/api/upload', formData, config)
      .then(res => {
        // console.log('upload-success', res)
        isLoading(false)

        if (res.data.result === 'success') {
          const path = JSON.stringify(res.data.file)
          database.ref(`/${settings.key}/config`).update({ profileImage: path })
          setProfileImage(path)
        }
      })
      .catch(err => {
        // console.log('upload-failure', err)
        isLoading(false)
      })
  }

  /* file remove handler */
  const handleFileRemove = () => {
    if (profileImage === null) return

    database.ref(`/${settings.key}/config`).update({ profileImage: null })
    setProfileImage(null)

    // s3 file remove
    const config = { headers: { 'content-type': 'multipart/form-data' } }
    const formData = new FormData()
    formData.append('filename', JSON.parse(profileImage).name)
    formData.append('key', settings.key)

    return axios.post('/api/remove', formData, config)
      .then(res => {
        // console.log('upload-success', res)
        isLoading(false)

        if (res.data.result === 'success') {
          // console.log(res)
        }
      })
      .catch(err => {
        // console.log('upload-failure', err)
      })
  }

  const updateUserInfo = () => {
    database.ref(`/${settings.key}/config`).update({
      title: title || initConfig.title,
      subTitle: subTitle || initConfig.subTitle,
      nickname: nickname || initConfig.nickname,
      firstMessage: firstMessage || initConfig.firstMessage,
      themeColor: themeColor || initConfig.themeColor
    })
  }

  let mo, tu, we, th, fr, sa, su,
      startWork, endWork, startBreak, endBreak,
      allday, breaktime, message
  const onChangeWorkingDay = (e) => {
    const week = []
    if (mo.checked) week.push('mo')
    if (tu.checked) week.push('tu')
    if (we.checked) week.push('we')
    if (th.checked) week.push('th')
    if (fr.checked) week.push('fr')
    if (sa.checked) week.push('sa')
    if (su.checked) week.push('su')

    setWorkingDay({
      ...workingDay,
      week: week,
      allday: allday.checked,
      startWork: startWork.value,
      endWork: endWork.value,
      breaktime: breaktime.checked,
      startBreak: startBreak.value,
      endBreak: endBreak.value,
      message: message.value.trim().substring(0, 200)
    })    
  }

  React.useEffect(() => {
    if (workingDay.isInit) return

    database.ref(`/${settings.key}/config`).update({
      workingDay: workingDay
    })      
  }, [database, settings.key, workingDay])

  return (
    <div className="setting">
      <div className="setting-list card">
        <div className="setting-list-title">Settings</div>
        <div
          className={ settingMenuState === 0 ? "setting-list-tab active" : "setting-list-tab"}
          onClick={() => { setSettingMenuState(0) }}>
          <div>기본 설정</div>
        </div>
        <div
          className={ settingMenuState === 1 ? "setting-list-tab active" : "setting-list-tab"}
          onClick={() => { setSettingMenuState(1) }}>
          <div>채팅 설정</div>
        </div>
        {/* <div className="setting-list-title">Etc</div>
        <div className="setting-list-tab"
          onClick={() => {
            if (typeof(shell) === "object") {
              shell.openExternal('https://smlog.co.kr/member/member_join_check.htm')
            }
          }}>새 소식</div>
        <div className="setting-list-tab"
          onClick={() => {
            if (typeof(shell) === "object") {
              shell.openExternal('https://smlog.co.kr/member/id_pass.htm')
            }
          }}>고객센터</div>
        <div
          className={ settingMenuState === 2 ? "setting-list-tab active" : "setting-list-tab"}
          onClick={() => { setSettingMenuState(2) }}>
          <div>버전 정보</div>
        </div> */}
      </div>

      <div className="setting-body card">
        <div className={ settingMenuState === 0 ? "setting-menu-0" : "setting-menu-0 hide" }>
          <div className="setting-menu-header">
            기본 설정
          </div>
          <div className="setting-menu-body setting-basic">     
            <div className="setting-checkbox-item">
              <div className="setting-checkbox-item-title">
                <label>
                  <input type="checkbox"
                    checked={useChat}
                    onChange={(e) => {
                      const use = e.target.checked
                      // SET USE CHAT
                      smlog.API({
                        method: 'update_chat_state',
                        svid: props.svid,
                        is_use_chat: use ? 1 : 0
                      }).then(({code}) => {
                        code === "1" && setUseChat(use)
                      })
                    }}/>
                  <span>채팅기능 사용</span>
                </label>
              </div>
            </div>      
            <div className="setting-checkbox-item">
              <div className="setting-checkbox-item-title">
                <label>
                  <input type="checkbox"
                    checked={workingDay.use}
                    onChange={(e) => {
                      // SET WORKING DATETIME
                      setWorkingDay({...workingDay, use: e.target.checked, isInit: null})                      
                    }}/>
                  <span>채팅시간 설정</span>
                </label>
              </div>
              <div className="setting-checkbox-item-description">채팅 가능 요일 및 시간을 지정하면 그 외의 시간대와 브레이크 타임에는 채팅창이 노출되지 않습니다.</div>
              <div className="setting-checkbox-item-description">해당 시간대 이전에 채팅창을 미리 띄워놓은 사용자에게는 부재중 메세지가 전송됩니다.</div>
              { workingDay.use && (
                <div className="setting-working-day">
                  <div className="setting-working-week">
                    <label><input type="checkbox" ref={node => mo = node} checked={workingDay.week.indexOf('mo') > -1} onChange={(e) => { onChangeWorkingDay(e) }}/>월</label>
                    <label><input type="checkbox" ref={node => tu = node} checked={workingDay.week.indexOf('tu') > -1} onChange={(e) => { onChangeWorkingDay(e) }}/>화</label>
                    <label><input type="checkbox" ref={node => we = node} checked={workingDay.week.indexOf('we') > -1} onChange={(e) => { onChangeWorkingDay(e) }}/>수</label>
                    <label><input type="checkbox" ref={node => th = node} checked={workingDay.week.indexOf('th') > -1} onChange={(e) => { onChangeWorkingDay(e) }}/>목</label>
                    <label><input type="checkbox" ref={node => fr = node} checked={workingDay.week.indexOf('fr') > -1} onChange={(e) => { onChangeWorkingDay(e) }}/>금</label>
                    <label><input type="checkbox" ref={node => sa = node} checked={workingDay.week.indexOf('sa') > -1} onChange={(e) => { onChangeWorkingDay(e) }}/>토</label>                  
                    <label><input type="checkbox" ref={node => su = node} checked={workingDay.week.indexOf('su') > -1} onChange={(e) => { onChangeWorkingDay(e) }}/>일</label>
                  </div>
                  <div className="setting-working-time">
                    <div className="setting-working-time-title">채팅가능 시간</div>
                    <div className={workingDay.allday ? 'hide' : ''}><div>
                      <select ref={node => startWork = node} value={workingDay.startWork} onChange={(e) => { onChangeWorkingDay(e) }}>
                        <option value="0000">00:00</option><option value="0030">00:30</option>                        
                        <option value="0100">01:00</option><option value="0130">01:30</option>
                        <option value="0200">02:00</option><option value="0230">02:30</option>
                        <option value="0300">03:00</option><option value="0330">03:30</option>
                        <option value="0400">04:00</option><option value="0430">04:30</option>
                        <option value="0500">05:00</option><option value="0530">05:30</option>
                        <option value="0600">06:00</option><option value="0630">06:30</option>
                        <option value="0700">07:00</option><option value="0730">07:30</option>
                        <option value="0800">08:00</option><option value="0830">08:30</option>
                        <option value="0900">09:00</option><option value="0930">09:30</option>
                        <option value="1000">10:00</option><option value="1030">10:30</option>
                        <option value="1100">11:00</option><option value="1130">11:30</option>
                        <option value="1200">12:00</option><option value="1230">12:30</option>
                        <option value="1300">13:00</option><option value="1330">13:30</option>
                        <option value="1400">14:00</option><option value="1430">14:30</option>
                        <option value="1500">15:00</option><option value="1530">15:30</option>
                        <option value="1600">16:00</option><option value="1630">16:30</option>
                        <option value="1700">17:00</option><option value="1730">17:30</option>
                        <option value="1800">18:00</option><option value="1830">18:30</option>
                        <option value="1900">19:00</option><option value="1930">19:30</option>
                        <option value="2000">20:00</option><option value="2030">20:30</option>
                        <option value="2100">21:00</option><option value="2130">21:30</option>
                        <option value="2200">22:00</option><option value="2230">22:30</option>
                        <option value="2300">23:00</option><option value="2330">23:30</option>
                      </select>
                    </div>
                    <div>~</div>
                    <div>
                      <select ref={node => endWork = node} value={workingDay.endWork} onChange={(e) => { onChangeWorkingDay(e) }}>
                        <option value="0000">00:00</option><option value="0030">00:30</option>                        
                        <option value="0100">01:00</option><option value="0130">01:30</option>
                        <option value="0200">02:00</option><option value="0230">02:30</option>
                        <option value="0300">03:00</option><option value="0330">03:30</option>
                        <option value="0400">04:00</option><option value="0430">04:30</option>
                        <option value="0500">05:00</option><option value="0530">05:30</option>
                        <option value="0600">06:00</option><option value="0630">06:30</option>
                        <option value="0700">07:00</option><option value="0730">07:30</option>
                        <option value="0800">08:00</option><option value="0830">08:30</option>
                        <option value="0900">09:00</option><option value="0930">09:30</option>
                        <option value="1000">10:00</option><option value="1030">10:30</option>
                        <option value="1100">11:00</option><option value="1130">11:30</option>
                        <option value="1200">12:00</option><option value="1230">12:30</option>
                        <option value="1300">13:00</option><option value="1330">13:30</option>
                        <option value="1400">14:00</option><option value="1430">14:30</option>
                        <option value="1500">15:00</option><option value="1530">15:30</option>
                        <option value="1600">16:00</option><option value="1630">16:30</option>
                        <option value="1700">17:00</option><option value="1730">17:30</option>
                        <option value="1800">18:00</option><option value="1830">18:30</option>
                        <option value="1900">19:00</option><option value="1930">19:30</option>
                        <option value="2000">20:00</option><option value="2030">20:30</option>
                        <option value="2100">21:00</option><option value="2130">21:30</option>
                        <option value="2200">22:00</option><option value="2230">22:30</option>
                        <option value="2300">23:00</option><option value="2330">23:30</option>
                      </select>
                    </div></div>
                    <div><label><input type="checkbox" ref={node => allday = node} checked={workingDay.allday} onChange={(e) => { onChangeWorkingDay(e) }}/>종일</label></div>
                  </div>
                  <div className="setting-working-time">
                    <div className="setting-working-time-title">브레이크 타임</div>
                    <div className={workingDay.breaktime ? '' : 'hide'}><div>
                      <select ref={node => startBreak = node} value={workingDay.startBreak} onChange={(e) => { onChangeWorkingDay(e) }}>
                        <option value="0000">00:00</option><option value="0030">00:30</option>                        
                        <option value="0100">01:00</option><option value="0130">01:30</option>
                        <option value="0200">02:00</option><option value="0230">02:30</option>
                        <option value="0300">03:00</option><option value="0330">03:30</option>
                        <option value="0400">04:00</option><option value="0430">04:30</option>
                        <option value="0500">05:00</option><option value="0530">05:30</option>
                        <option value="0600">06:00</option><option value="0630">06:30</option>
                        <option value="0700">07:00</option><option value="0730">07:30</option>
                        <option value="0800">08:00</option><option value="0830">08:30</option>
                        <option value="0900">09:00</option><option value="0930">09:30</option>
                        <option value="1000">10:00</option><option value="1030">10:30</option>
                        <option value="1100">11:00</option><option value="1130">11:30</option>
                        <option value="1200">12:00</option><option value="1230">12:30</option>
                        <option value="1300">13:00</option><option value="1330">13:30</option>
                        <option value="1400">14:00</option><option value="1430">14:30</option>
                        <option value="1500">15:00</option><option value="1530">15:30</option>
                        <option value="1600">16:00</option><option value="1630">16:30</option>
                        <option value="1700">17:00</option><option value="1730">17:30</option>
                        <option value="1800">18:00</option><option value="1830">18:30</option>
                        <option value="1900">19:00</option><option value="1930">19:30</option>
                        <option value="2000">20:00</option><option value="2030">20:30</option>
                        <option value="2100">21:00</option><option value="2130">21:30</option>
                        <option value="2200">22:00</option><option value="2230">22:30</option>
                        <option value="2300">23:00</option><option value="2330">23:30</option>
                      </select>
                    </div>
                    <div>~</div>
                    <div>
                      <select ref={node => endBreak = node} value={workingDay.endBreak} onChange={(e) => { onChangeWorkingDay(e) }}>
                        <option value="0000">00:00</option><option value="0030">00:30</option>                        
                        <option value="0100">01:00</option><option value="0130">01:30</option>
                        <option value="0200">02:00</option><option value="0230">02:30</option>
                        <option value="0300">03:00</option><option value="0330">03:30</option>
                        <option value="0400">04:00</option><option value="0430">04:30</option>
                        <option value="0500">05:00</option><option value="0530">05:30</option>
                        <option value="0600">06:00</option><option value="0630">06:30</option>
                        <option value="0700">07:00</option><option value="0730">07:30</option>
                        <option value="0800">08:00</option><option value="0830">08:30</option>
                        <option value="0900">09:00</option><option value="0930">09:30</option>
                        <option value="1000">10:00</option><option value="1030">10:30</option>
                        <option value="1100">11:00</option><option value="1130">11:30</option>
                        <option value="1200">12:00</option><option value="1230">12:30</option>
                        <option value="1300">13:00</option><option value="1330">13:30</option>
                        <option value="1400">14:00</option><option value="1430">14:30</option>
                        <option value="1500">15:00</option><option value="1530">15:30</option>
                        <option value="1600">16:00</option><option value="1630">16:30</option>
                        <option value="1700">17:00</option><option value="1730">17:30</option>
                        <option value="1800">18:00</option><option value="1830">18:30</option>
                        <option value="1900">19:00</option><option value="1930">19:30</option>
                        <option value="2000">20:00</option><option value="2030">20:30</option>
                        <option value="2100">21:00</option><option value="2130">21:30</option>
                        <option value="2200">22:00</option><option value="2230">22:30</option>
                        <option value="2300">23:00</option><option value="2330">23:30</option>
                      </select>
                    </div></div>
                    <div><label><input type="checkbox" ref={node => breaktime = node} checked={workingDay.breaktime} onChange={(e) => { onChangeWorkingDay(e) }}/>사용하기</label></div>
                  </div>
                  <div className="setting-working-message">
                    <div className="setting-working-message-title">부재중 메세지 (최대 200자)</div>
                    <textarea 
                      ref={node => message = node}
                      value={missedMessage}
                      onChange={(e) => {setMissedMessage(e.target.value)}}
                      onBlur={(e) => {onChangeWorkingDay(e)}}>
                    </textarea>
                  </div>
                </div>
              )}
            </div>
            <div className="setting-checkbox-item setting-checkbox-item-guide">
              <div>
                <div style={{fontWeight: 'bold', marginBottom: 5, fontSize: 14}}>채팅 알람이 오지 않는다면?</div>
                <div style={{color: 'rgba(117, 124, 140, 1)'}}>아래 링크를 참고해 브라우저별 채팅 알람 켜는 방법을 확인해보세요.</div>
              </div>
              <div style={{padding: 15}}>
                <div style={{marginBottom: 10, display: 'flex', flexDirection: 'row'}}>
                  <div style={{width: 180}}>* 크롬 브라우저(Chrome)</div>
                  <a href="http://smlog.co.kr/faq_view.htm?no=475" target="_blank">http://smlog.co.kr/faq_view.htm?no=475</a>
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <div style={{width: 180}}>* 엣지 브라우저(Edge)</div>
                  <a href="http://smlog.co.kr/faq_view.htm?no=476" target="_blank">http://smlog.co.kr/faq_view.htm?no=476</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={ settingMenuState === 1 ? "setting-menu-1" : "setting-menu-1 hide" }>
          <div className="setting-menu-header">
            채팅 설정
          </div>
          <div className="setting-menu-body">
            <div className="setting-mockup">
              <Mockup
                title={title}
                subTitle={subTitle}
                nickname={nickname}
                firstMessage={firstMessage}
                themeColor={themeColor}
                profileImage={profileImage}/>

              <div className="setting-theme">
                <div className="setting-input-item">
                  <span>테마색상</span>
                  <input type="text"
                    value={themeColor}                    
                    onChange={() => {}}
                    onClick={() => {
                      showThemeColorPicker(!themeColorPicker)
                    }}/>
                  <div className="setting-color-sample" style={{ backgroundColor: themeColor }}></div>
                  <div className={themeColorPicker ? "setting-color-picker active" : "setting-color-picker"}>
                    <ChromePicker
                      color={themeColor}
                      onChange={(color) => { 
                        const _color = color.rgb.a === 1 ? color.hex : `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
                        setThemeColor(_color) 
                      }}/>
                    <div className="empty-background"
                      onClick={() => {
                        updateUserInfo()
                        showThemeColorPicker(false)
                      }}>
                    </div>
                  </div>
                </div>
                <div className="setting-input-item">
                  <span>프로필 이미지</span>
                  <div style={{ display: "flex" }}>
                    <label className="setting-profile-image-upload">
                      <div>새 이미지 업로드</div>
                      <input type="file" onChange={e => handleFileInput(e)}/>
                    </label>
                    <div
                      className="setting-profile-image-remove"
                      onClick={() => { handleFileRemove() }}>이미지 삭제</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, marginLeft: 20, maxWidth: 400 }}>
              <div className="setting-input-item">
                <span>제목</span>                
                <input value={title}
                  onBlur={() => updateUserInfo()}
                  onChange={(e) => { setTitle(e.target.value) }}/>
              </div>
              <div className="setting-input-item">
                <span>설명</span>
                <input value={subTitle}
                  onBlur={() => updateUserInfo()}
                  onChange={(e) => { setSubTitle(e.target.value) }}/>
              </div>
              <div className="setting-input-item">
                <span>프로필 이름</span>
                <input value={nickname}
                  onBlur={() => updateUserInfo()}
                  onChange={(e) => { setNickname(e.target.value) }}/>
              </div>
              <div className="setting-input-item">
                <span>첫 응대 메세지</span>
                <textarea value={firstMessage}
                  onBlur={() => updateUserInfo()}
                  onChange={(e) => { setFirstMessage(e.target.value) }}/>
              </div>
            </div>
          </div>
        </div>

        <div className={ settingMenuState === 2 ? "setting-menu-2" : "setting-menu-2 hide" }>
          <div className="setting-menu-header">
            버전 정보
          </div>
          <div className="setting-menu-body">
          </div>
        </div>

        <div className={ settingMenuState === 3 ? "setting-menu-3" : "setting-menu-3 hide" }>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  users: state.users,
  settings: state.settings
})

// export default Setting
export default connect(mapStateToProps)(Setting)
