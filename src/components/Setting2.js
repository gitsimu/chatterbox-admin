import React from 'react'
import { connect } from 'react-redux'
import * as smlog from '../js/smlog'
import * as script from '../js/script'
import SettingChatbot from './SettingChatbot'

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

const Setting2 = ({ _key : key, database, isLoading, ...props }) => {

  const [initAfter, setInitAfter] = React.useState(false)
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
        const chatConfigData = convertChatConfig(firebaseData, dbData)
        setChatConfig(chatConfigData)

        const chatbotConfigData = convertChatbotConfig(firebaseData)
        setChatbotConfig(chatbotConfigData)
      })
      .finally(()=> setInitAfter(true))
  }, [database, key])

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
      <div className="setting-body card">
        <div className="setting-menu-3">
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
export default connect(mapStateToProps)(Setting2)
