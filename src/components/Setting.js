import React from 'react'
import { connect } from 'react-redux'
import * as smlog from '../js/smlog'
import * as script from '../js/script'
import SettingChatbot from './SettingChatbot'
import SettingBasic from './SettingBasic'
import SettingChat from './SettingChat'

const initialBasic = {
  useChat : false,
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

const initialChat = {
  title: '채팅 상담',
  subTitle: '보통 몇 분 내에 응답합니다',
  nickname: 'Manager',
  firstMessage: '방문해주셔서 감사합니다.\n궁금한 내용을 편하게 남겨주세요.',
  themeColor: '#444c5d',
  position: 'rb',
  iconText : '',
  iconTextAlign : 'left',
  profileImage: null,
  pc: {
    hide: false,
    axisX: 15,
    axisY: 15,
    size: 70
  },
  mobile: {
    hide: false,
    axisX: 15,
    axisY: 15,
    size: 70
  }
}

const initialChatbot = {
  state: '0',
  list : (()=>{
    const chatId = script.genId()
    return [
      {id: script.genId(), title: '처음으로', questions: [{message: '안녕하세요 챗봇입니다.', type: 1}, {message: '궁금한 사항을 선택해주세요.', type: 1}], answers: [{message:'상담원 연결', to: chatId}]},
      {id: chatId, title: '상담원 연결', questions: [{message: '상담원을 연결해드리겠습니다.', type: 1}], answers: [], action: 'CHAT'},
    ]
  })()
}

const Setting = ({ _key : key, database, isLoading, ...props }) => {

  const [settingMenuState, setSettingMenuState] = React.useState(0)
  const [initAfter, setInitAfter] = React.useState(false)
  const [basicConfig, setBasicConfig] = React.useState(null)
  const [chatConfig, setChatConfig] = React.useState(null)
  const [chatbotConfig, setChatbotConfig] = React.useState(null)

  React.useEffect(() => {
    const getFirebase = database.ref(`/${key}/config`).once('value')
    const getDb =  smlog.API({
      method: 'get_chat_config',
      svid: props.svid
    })

    Promise.all([getFirebase, getDb])
      .then(([snapshot, dbData])=> Promise.all([snapshot.val(), dbData]))
      .then(([firebaseData, dbData])=> {
        const basicConfigData = convertBasicConfig(firebaseData, dbData)
        setBasicConfig(basicConfigData)

        const chatConfigData = convertChatConfig(firebaseData, dbData)
        setChatConfig(chatConfigData)

        const chatbotConfigData = convertChatbotConfig(firebaseData)
        setChatbotConfig(chatbotConfigData)
      })
      .finally(()=> setInitAfter(true))
  }, [database, key])

  const updateBasicConfig = React.useCallback((newBasicConfig) => {
    const updateUseChat = basicConfig.useChat !== newBasicConfig.useChat
    setBasicConfig(newBasicConfig)

    database.ref(`/${key}/config`).update({
      workingDay: newBasicConfig
    })
    smlog.API({
      method: 'update_chat_workingday',
      svid: props.svid,
      use: newBasicConfig.use ? '1' : '0',
      state: newBasicConfig.useChat ? '1' : '0',
      allday: newBasicConfig.allday ? '1' : '0',
      startWork: newBasicConfig.startWork,
      endWork: newBasicConfig.endWork,
      breaktime: newBasicConfig.breaktime ? '1' : '0',
      startBreak: newBasicConfig.startBreak,
      endBreak: newBasicConfig.endBreak,
      week: (newBasicConfig.week || []).length
        ? newBasicConfig.week.join(',')
        : ''
    })
    if(updateUseChat){
      smlog.API({
        method: 'update_chat_state',
        svid: props.svid,
        is_use_chat: newBasicConfig.useChat ? '1' : '0'
      })
    }
  }, [basicConfig, props.svid])

  const updateChatConfig = React.useCallback((newChatConfig) => {
    setChatConfig(newChatConfig)

    database.ref(`/${key}/config`).update({
      title: newChatConfig.title,
      subTitle: newChatConfig.subTitle,
      nickname: newChatConfig.nickname,
      firstMessage: newChatConfig.firstMessage,
      themeColor: newChatConfig.themeColor,
      profileImage: newChatConfig.profileImage
    })
    smlog.API({
        method: 'update_chat_icon_config',
        svid: props.svid,
        scm_theme_color: newChatConfig.themeColor,
        scm_position: newChatConfig.position,
        scm_pc_display: newChatConfig.pc.hide ? '0' : '1',
        scm_pc_x: newChatConfig.pc.axisX,
        scm_pc_y: newChatConfig.pc.axisY,
        scm_pc_width: newChatConfig.pc.size,
        scm_mo_display: newChatConfig.mobile.hide ? '0' : '1',
        scm_mo_x: newChatConfig.mobile.axisX,
        scm_mo_y: newChatConfig.mobile.axisY,
        scm_mo_width: newChatConfig.mobile.size,
        scm_icon_text: newChatConfig.iconText || '',
        scm_icon_text_align: newChatConfig.iconTextAlign || 'left'
      }
    )
  }, [props.svid])

  const updateChatbotConfig = React.useCallback((newChatbotConfig) => {
    setChatbotConfig(newChatbotConfig)

    isLoading(true)

    const a = database.ref(`/${key}/config/chatbot`)
      .update({
        state: newChatbotConfig.state,
        list: newChatbotConfig.list
      })

    const b = smlog.API({
      method: 'update_chatbot_config',
      svid: props.svid,
      state : newChatbotConfig.state
    })

    Promise.all([a,b])
      .finally(()=> isLoading(false))
  }, [props.svid])

  const convertBasicConfig = (firebaseData, dbData) => {
    const byDb = dbData && {
      useChat: dbData.scm_state === '1',
      use: dbData.scm_time_state === '1',
      week: dbData.scm_weeks ? dbData.scm_weeks.split(',') : [],
      allday: dbData.scm_all_day === '1',
      startWork: dbData.scm_view_time_s || initialBasic.startWork,
      endWork: dbData.scm_view_time_e || initialBasic.endWork,
      breaktime: dbData.scm_break_time === '1',
      startBreak: dbData.scm_break_time_s || initialBasic.startBreak,
      endBreak: dbData.scm_break_time_e || initialBasic.endBreak
    }
    const byFirebase = firebaseData && firebaseData.workingDay && {
      message: firebaseData.workingDay.message || ''
    }

    return { ...initialBasic, ...byDb, ...byFirebase }
  }

  const convertChatConfig = (firebaseData, dbData) => {
    const byDb = dbData && {
      iconText: dbData.scm_icon_text,
      iconTextAlign: dbData.scm_icon_text_align,
      position: dbData.scm_position,
      pc: {
        hide: dbData.scm_pc_display === '0',
        axisX: +dbData.scm_pc_x,
        axisY: +dbData.scm_pc_y,
        size: +dbData.scm_pc_width
      },
      mobile: {
        hide: dbData.scm_mo_display === '0',
        axisX: +dbData.scm_mo_x,
        axisY: +dbData.scm_mo_y,
        size: +dbData.scm_mo_width
      }
    }

    const byFirebase = firebaseData && {
      title : firebaseData.title || initialChat.title,
      subTitle : firebaseData.subTitle || initialChat.subTitle,
      nickname : firebaseData.nickname || initialChat.nickname,
      firstMessage : firebaseData.firstMessage || initialChat.firstMessage,
      themeColor : firebaseData.themeColor || initialChat.themeColor,
      profileImage : firebaseData.profileImage || initialChat.profileImage,
    }

    return { ...initialChat, ...byDb, ...byFirebase }
  }

  const convertChatbotConfig = (firebaseData) => {
    return (firebaseData && firebaseData.chatbot) || initialChatbot
  }


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
        <div
          className={ settingMenuState === 3 ? "setting-list-tab active" : "setting-list-tab"}
          onClick={() => { setSettingMenuState(3) }}>
          <div>
            챗봇 설정
            <span className="new">NEW</span>
          </div>
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

          {initAfter && (
            <SettingBasic
              basicConfig={basicConfig}
              updateBasicConfig={updateBasicConfig}
            />
          )}
        </div>
        <div className={ settingMenuState === 1 ? "setting-menu-1" : "setting-menu-1 hide" }>
          <div className="setting-menu-header">
            채팅 설정
          </div>

          {initAfter && (
            <SettingChat
              chatConfig={chatConfig}
              updateChatConfig={updateChatConfig}
              isLoading={isLoading}
            />
          )}
        </div>
        <div className={ settingMenuState === 2 ? "setting-menu-2" : "setting-menu-2 hide" }>
          <div className="setting-menu-header">
            버전 정보
          </div>
          <div className="setting-menu-body">
          </div>
        </div>
        <div className={ settingMenuState === 3 ? "setting-menu-3" : "setting-menu-3 hide" }>
          <div className="setting-menu-header">
            챗봇 설정            
          </div>

          {initAfter && (
            <SettingChatbot
              chatbotConfig={chatbotConfig}
              updateChatbotConfig={updateChatbotConfig}
              showImageViewer={props.showImageViewer}
              nickname={chatConfig.nickname}
              profileImage={chatConfig.profileImage}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

    </div>
  )
}

const mapStateToProps = state => ({
  _key: state.settings.key
})

// export default Setting
export default connect(mapStateToProps)(Setting)
