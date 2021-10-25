import React from 'react'
import { connect } from 'react-redux'

const SettingBasic = ({ basicConfig, updateBasicConfig }) => {

  const [newConfig, setNewConfig] = React.useState(basicConfig)

  const weekDic = React.useRef(basicConfig.week.reduce((a,b)=> ((a[b] = true) && a), {}))
  const messageRef = React.useRef()

  const updateWeek = (key, value) => {
    weekDic.current[key] = value
    const newWeek = Object.keys(weekDic.current)
      .filter(w=> weekDic.current[w])

    updateConfig({week : newWeek})
  }

  const updateConfig = (newVal) => {
    setNewConfig(oldVal => ({ ...oldVal, ...newVal }))
  }

  React.useEffect(() => {
    if(!messageRef.current) return
    messageRef.current.value = basicConfig.message
  }, [basicConfig, newConfig.use])

  React.useEffect(() => {
    if(newConfig === basicConfig) return

    updateBasicConfig(newConfig)
  }, [newConfig])

  return (
    <div className="setting-menu-body setting-basic">
      <div className="setting-checkbox-item">
        <div className="setting-checkbox-item-title">
          <label>
            <input type="checkbox"
                   checked={newConfig.useChat}
                   onChange={(e) => updateConfig({useChat: e.target.checked})}/>
            <span>채팅기능 사용</span>
          </label>
        </div>
      </div>
      <div className="setting-checkbox-item">
        <div className="setting-checkbox-item-title">
          <label>
            <input type="checkbox"
                   checked={newConfig.use}
                   onChange={(e) => updateConfig({use : e.target.checked})}/>
            <span>채팅시간 설정</span>
          </label>
        </div>
        <div className="setting-checkbox-item-description">채팅 가능 요일 및 시간을 지정하면 그 외의 시간대와 브레이크 타임에는 채팅창이 노출되지 않습니다.</div>
        <div className="setting-checkbox-item-description">해당 시간대 이전에 채팅창을 미리 띄워놓은 사용자에게는 부재중 메세지가 전송됩니다.</div>
        { newConfig.use && (
          <div className="setting-working-day">
            <div className="setting-working-week">
              <label><input type="checkbox" checked={!!weekDic.current['mo']} onChange={(e) => { updateWeek('mo', e.target.checked)}}/>월</label>
              <label><input type="checkbox" checked={!!weekDic.current['tu']} onChange={(e) => { updateWeek('tu', e.target.checked)}}/>화</label>
              <label><input type="checkbox" checked={!!weekDic.current['we']} onChange={(e) => { updateWeek('we', e.target.checked)}}/>수</label>
              <label><input type="checkbox" checked={!!weekDic.current['th']} onChange={(e) => { updateWeek('th', e.target.checked)}}/>목</label>
              <label><input type="checkbox" checked={!!weekDic.current['fr']} onChange={(e) => { updateWeek('fr', e.target.checked)}}/>금</label>
              <label><input type="checkbox" checked={!!weekDic.current['sa']} onChange={(e) => { updateWeek('sa', e.target.checked)}}/>토</label>
              <label><input type="checkbox" checked={!!weekDic.current['su']} onChange={(e) => { updateWeek('su', e.target.checked)}}/>일</label>
            </div>
            <div className="setting-working-time">
              <div className="setting-working-time-title">채팅가능 시간</div>
              <div className={newConfig.allday ? 'hide' : ''}><div>
                <select value={newConfig.startWork} onChange={(e) => { updateConfig({startWork : e.target.value}) }}>
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
                  <select value={newConfig.endWork} onChange={(e) => { updateConfig({endWork: e.target.value}) }}>
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
              <div><label><input type="checkbox" checked={newConfig.allday} onChange={(e) => { updateConfig({ allday: e.target.checked }) }}/>종일</label></div>
            </div>
            <div className="setting-working-time">
              <div className="setting-working-time-title">브레이크 타임</div>
              <div className={newConfig.breaktime ? '' : 'hide'}><div>
                <select value={newConfig.startBreak} onChange={(e) => { updateConfig({startBreak: e.target.value}) }}>
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
                  <select value={newConfig.endBreak} onChange={(e) => { updateConfig({endBreak: e.target.value}) }}>
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
              <div><label><input type="checkbox" checked={newConfig.breaktime} onChange={(e) => { updateConfig({ breaktime: e.target.checked}) }}/>사용하기</label></div>
            </div>
            <div className="setting-working-message">
              <div className="setting-working-message-title">부재중 메세지 (최대 200자)</div>
              <textarea
                ref={messageRef}
                onBlur={() => {
                  updateConfig({message: messageRef.current.value.trim().substring(0, 200) })
                }}>
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
            <a href="https://smlog.co.kr/2020/read_guide.html?no=475" target="_blank">https://smlog.co.kr/2020/read_guide.html?no=475</a>
          </div>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{width: 180}}>* 엣지 브라우저(Edge)</div>
            <a href="https://smlog.co.kr/2020/read_guide.html?no=476" target="_blank">https://smlog.co.kr/2020/read_guide.html?no=476</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  //info: state.info
})

const mapDispatchToProps = dispatch => ({
  //initMessage: m => dispatch(initMessage(m))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingBasic);