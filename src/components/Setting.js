import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { ChromePicker } from 'react-color'
import PrettoSlider from './PrettoSlider'
import * as smlog from '../js/smlog'
import * as script from '../js/script'
import Mockup from './Mockup'
import Chatbot from './Chatbot'
import ChatbotPreview from './ChatbotPreview'
import useImageUpload from '../hooks/useImageUpload'

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
  themeColor: '#444c5d',
  chatbot: {
    state: '0',
    list : [
      {id: script.genId(), title: '처음으로', questions: [{message: '안녕하세요 챗봇입니다.', type: 1}, {message: '궁금한 사항을 선택해주세요.', type: 1}], answers: [{message:'상담원 연결', to:'CHAT'}]},
      {id: script.genId(), title: '상담원 연결', questions: [{message: '상담원을 연결해드리겠습니다.', type: 1}], answers: [], action: 'CHAT'},
    ]
  }
}
const initIconConfig = {
  isInit: true,
  themeColor: '#444c5d',
  position: 'rb',
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
const chatbotTemplate = [
  {
    name: '쇼핑몰',
    description: '쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 ',
    list: [
      {
        title: '쇼핑몰1',
        id: '1',
        questions: [
          {
            message: '안녕하세요 쇼핑몰 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }
        ],
        answers: [
          {
            message: '2번으로',
            to: '2'
          },
          {
            message: '3번으로',
            to: '3'
          }
        ]
      },
      {
        title: '쇼핑몰2',
        id: '2',
        questions: [
          {
            message: '안녕하세요 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }],
        answers: [
          {
            message: '1번으로',
            to: '1'
          },
          {
            message: '3번으로',
            to: '3'
          }
        ]
      },
      {
        title: '쇼핑몰3',
        id: '3',
        questions: [
          {
            message: '안녕하세요 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }
        ],
        answers: [
          {
            message: '1번으로',
            to: '1'
          },
          {
            message: '2번으로',
            to: '2'
          }
        ]
      }
    ],
  },
  {
    name: '프렌차이즈',
    description: '프렌차이즈 입니다 프렌차이즈 입니다 프렌차이즈 입니다 ',
    list: [
      {
        title: '프렌차이즈1',
        id: '1',
        questions: [
          {
            message: '안녕하세요 프렌차이즈 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }],
        answers: [
          {
            message: '2번으로',
            to: '2'
          }
        ]
      },
      {
        title: '프렌차이즈2',
        id: '2',
        questions: [
          {
            message: '안녕하세요 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }],
        answers: [
          {
            message: '1번으로',
            to: '1'
          }
        ]
      },
      {
        title: '프렌차이즈3',
        id: '3',
        questions: [
          {
            message: '안녕하세요 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }],
        answers: [
          {
            message: '1번으로',
            to: '1'
          },
          {
            message: '2번으로',
            to: '2'
          }
        ]
      }
    ],
  },
  {
    name: '스타트업',
    description: '스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 ',
    list: [
      {
        title: '스타트업1',
        id: '1',
        questions: [
          {
            message: '안녕하세요 스타트업 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }
        ],
        answers: [
          {
            message: '2번으로',
            to: '2'
          },
          {
            message: '3번으로',
            to: '3'
          }
        ]
      },
      {
        title: '스타트업2',
        id: '2',
        questions: [
          {
            message: '안녕하세요 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }],
        answers: [
          {
            message: '1번으로',
            to: '1'
          },
          {
            message: '3번으로',
            to: '3'
          }
        ]
      },
      {
        title: '스타트업3',
        id: '3',
        questions: [
          {
            message: '안녕하세요 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }
        ],
        answers: [
          {
            message: '1번으로',
            to: '1'
          },
          {
            message: '2번으로',
            to: '2'
          }
        ]
      }
    ],
  },
  {
    name: '쇼핑몰',
    description: '쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 쇼핑몰입니다 ',
    list: [
      {
        title: '쇼핑몰1',
        id: '1',
        questions: [
          {
            message: '안녕하세요 쇼핑몰 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }
        ],
        answers: [
          {
            message: '2번으로',
            to: '2'
          },
          {
            message: '3번으로',
            to: '3'
          }
        ]
      },
      {
        title: '쇼핑몰2',
        id: '2',
        questions: [
          {
            message: '안녕하세요 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }],
        answers: [
          {
            message: '1번으로',
            to: '1'
          },
          {
            message: '3번으로',
            to: '3'
          }
        ]
      },
      {
        title: '쇼핑몰3',
        id: '3',
        questions: [
          {
            message: '안녕하세요 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }
        ],
        answers: [
          {
            message: '1번으로',
            to: '1'
          },
          {
            message: '2번으로',
            to: '2'
          }
        ]
      }
    ],
  },
  {
    name: '프렌차이즈',
    description: '프렌차이즈 입니다 프렌차이즈 입니다 프렌차이즈 입니다 ',
    list: [
      {
        title: '프렌차이즈1',
        id: '1',
        questions: [
          {
            message: '안녕하세요 프렌차이즈 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }],
        answers: [
          {
            message: '2번으로',
            to: '2'
          }
        ]
      },
      {
        title: '프렌차이즈2',
        id: '2',
        questions: [
          {
            message: '안녕하세요 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }],
        answers: [
          {
            message: '1번으로',
            to: '1'
          }
        ]
      },
      {
        title: '프렌차이즈3',
        id: '3',
        questions: [
          {
            message: '안녕하세요 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }],
        answers: [
          {
            message: '1번으로',
            to: '1'
          },
          {
            message: '2번으로',
            to: '2'
          }
        ]
      }
    ],
  },
  {
    name: '스타트업',
    description: '스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 스타트업입니다 ',
    list: [
      {
        title: '스타트업1',
        id: '1',
        questions: [
          {
            message: '안녕하세요 스타트업 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }
        ],
        answers: [
          {
            message: '2번으로',
            to: '2'
          },
          {
            message: '3번으로',
            to: '3'
          }
        ]
      },
      {
        title: '스타트업2',
        id: '2',
        questions: [
          {
            message: '안녕하세요 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }],
        answers: [
          {
            message: '1번으로',
            to: '1'
          },
          {
            message: '3번으로',
            to: '3'
          }
        ]
      },
      {
        title: '스타트업3',
        id: '3',
        questions: [
          {
            message: '안녕하세요 챗봇입니다.',
            type: 1
          }, {
            message: '궁금한 사항을 선택해주세요.',
            type: 1
          }
        ],
        answers: [
          {
            message: '1번으로',
            to: '1'
          },
          {
            message: '2번으로',
            to: '2'
          }
        ]
      }
    ],
  }
]

const Setting = ({ settings, ...props }) => {
  const database = props.database
  const isLoading = props.isLoading

  const [title, setTitle] = React.useState('')
  const [subTitle, setSubTitle] = React.useState('')
  const [nickname, setNickname] = React.useState('')
  const [firstMessage, setFirstMessage] = React.useState('')
  const [profileImage, setProfileImage] = React.useState(null)
  const [themeColor, setThemeColor] = React.useState('#444c5d')
  const [themeColorPicker, showThemeColorPicker] = React.useState(false)
  
  const [useChat, setUseChat] = React.useState(false)
  const [workingDay, setWorkingDay] = React.useState(initWorkingDay)
  const [missedMessage, setMissedMessage] = React.useState('')
  const [settingMenuState, setSettingMenuState] = React.useState(0)

  const [selectDevice, setSelectDevice] = React.useState(0)
  const [iconConfig, setIconConfig] = React.useState(initIconConfig)

  const [iconHide, setIconHide] = React.useState(initIconConfig.pc.hide)
  const [iconPosition, setIconPosition] = React.useState(initIconConfig.position)
  const [iconAxisX, setIconAxisX] = React.useState(initIconConfig.pc.axisX)
  const [iconAxisY, setIconAxisY] = React.useState(initIconConfig.pc.axisY)
  const [iconSize, setIconSize] = React.useState(initIconConfig.pc.size)
  const [iconText, setIconText] = React.useState()
  const [iconTextAlign, setIconTextAlign] = React.useState()

  const chatbotListOrigin = React.useRef([])
  const [chatbotList, setChatbotList] = React.useState(initConfig.chatbot.list)
  const [chatbotState, setChatbotState] = React.useState(initConfig.chatbot.state)
  const [showChatbotTemplate, setShowChatbotTemplate] = React.useState(false)
  const [seletedTemplate, setSeletedTemplate] = React.useState(null)
  const [showChatbotPreview, setShowChatbotPreview] = React.useState(false)

  let [uploadImage] = useImageUpload()

  const setChatbotConfig = (chatbotConfig) => {
    if(!chatbotConfig) return

    setChatbotState(chatbotConfig.state)
    chatbotListOrigin.current = chatbotConfig.list
    resetChatbotList()
  }

  const resetChatbotList= () => {
    setChatbotList(JSON.parse(JSON.stringify(chatbotListOrigin.current)))
  }

  const addChatbotFromTemplate = (_list) => {
    const list = JSON.parse(JSON.stringify(_list))
    const answersAll = list.reduce((a,b)=> [...a, ...b.answers], [])

    list.forEach(chatbot=> {
      const oldId = chatbot.id
      chatbot.id = script.genId()

      answersAll.forEach(answer => {
        if(answer.to !== oldId) return
        answer.to = chatbot.id
      })
    })

    setChatbotList([...chatbotList, ...list])
  }

  const saveChatbotConfig = () => {
    const hasEmptyQuestions = chatbotList.some(chatbot=> !chatbot.questions?.length)
    if(hasEmptyQuestions){
      alert("메시지가 없는 챗봇이 있습니다.")
      return
    }
    const hasEmptyAnswers = chatbotList.some(chatbot=> chatbot.action !== "CHAT" && !chatbot.answers?.length)
    if(hasEmptyAnswers){
      alert("버튼이 없는 챗봇이 있습니다.")
      return
    }
    const hasEmptyLink = chatbotList.some(chatbot=> chatbot.answers?.some(answer=> !answer.to) || false)
    if(hasEmptyLink){
      alert('연결되지 않은 링크가 있습니다.')
      return
    }

    console.log(chatbotList)

    isLoading(true)

    const updateDB = smlog.API({
      method: 'update_chatbot_config',
      svid: props.svid,
      state : chatbotState
    })
    const updateFirebase = database.ref(`/${settings.key}/config/chatbot`)
      .update({
        state: chatbotState,
        list: chatbotList
      })

    Promise.all([updateDB, updateFirebase])
      .then(()=> {
        chatbotListOrigin.current = chatbotList
        resetChatbotList()
        isLoading(false)
      })
  }

  React.useEffect(() => {
    const getFirebase = database.ref(`/${settings.key}/config`).once('value')
    const getDb =  smlog.API({
      method: 'get_chat_config',
      svid: props.svid
    })

    getFirebase.then((snapshot)=>{
      const firebaseData = snapshot.val()

      if (firebaseData) {
        setTitle(firebaseData.title)
        setSubTitle(firebaseData.subTitle)
        setNickname(firebaseData.nickname)
        setFirstMessage(firebaseData.firstMessage)
        setThemeColor(firebaseData.themeColor)
        setProfileImage(firebaseData.profileImage || null)
        setMissedMessage(firebaseData.workingDay.message)
        setChatbotConfig(firebaseData.chatbot)
      } else {
        setTitle(initConfig.title)
        setSubTitle(initConfig.subTitle)
        setNickname(initConfig.nickname)
        setFirstMessage(initConfig.firstMessage)
        setThemeColor(initConfig.themeColor)
      }
    })

    Promise.all([getFirebase, getDb])
           .then(([snapshot, dbData])=> {
             const firebaseData = snapshot.val()
             if(dbData){
               setWorkingDay({
                 isInit: true,
                 message: firebaseData ? firebaseData.workingDay.message : '',
                 use: dbData.scm_time_state === '1',
                 week: dbData.scm_weeks.split(','),
                 allday: dbData.scm_all_day === '1',
                 startWork: dbData.scm_view_time_s,
                 endWork: dbData.scm_view_time_e,
                 breaktime: dbData.scm_break_time === '1',
                 startBreak: dbData.scm_break_time_s,
                 endBreak: dbData.scm_break_time_e
               })
               setUseChat(dbData.scm_state === '1')
               setIconConfig({
                 isInit: true,
                 themeColor: firebaseData ? firebaseData.themeColor : initConfig.themeColor,
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
               })
               setIconHide(dbData.scm_pc_display === '0')
               setIconPosition(dbData.scm_position)
               setIconAxisX(+dbData.scm_pc_x)
               setIconAxisY(+dbData.scm_pc_y)
               setIconSize(+dbData.scm_pc_width)
               setIconText(dbData.scm_icon_text)
               setIconTextAlign(dbData.scm_icon_text_align)
               setSelectDevice(0)
             }
           })
  }, [database, settings.key])

  const handleFileInput = e => {
    const target = e.target.files[0]

    Promise.resolve()
      .then(() => isLoading(true))
      .then(() => uploadImage(target, {'tag' : 'profile'}))
      .then(res => {
        const path = JSON.stringify(res.data.file)
        database.ref(`/${settings.key}/config`).update({ profileImage: path })
        setProfileImage(path)
      })
      .catch(({ message }) => message && alert(message))
      .finally(() => isLoading(false))
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
      isInit: false,
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

    smlog.API({
      method: 'update_chat_workingday',
      svid: props.svid,
      themeColor: themeColor,
      use: workingDay.use ? '1' : '0',
      state: useChat ? '1' : '0',
      allday: workingDay.allday ? '1' : '0',
      startWork: workingDay.startWork,
      endWork: workingDay.endWork,
      breaktime: workingDay.breaktime ? '1' : '0',
      startBreak: workingDay.startBreak,
      endBreak: workingDay.endBreak,
      week: workingDay.week.join(',')
    })

  }, [database, settings.key, workingDay, useChat])

  const onChangeIconConfig = (param) => {

    let newConfig = {
      ...iconConfig,
      isInit:false,
      position: iconPosition,
      [selectDevice === 0 ? 'pc' : 'mobile'] : {
        hide: iconHide,
        axisX: iconAxisX,
        axisY: iconAxisY,
        size: iconSize,
        ...(param || {})
      },
      text: iconText,
      textAlign: iconTextAlign,
      ...(param || {})
    }

    setIconConfig(newConfig)
  }

  React.useEffect(()=>{
    if(iconConfig.isInit) return

    smlog.API({
        method: 'update_chat_icon_config',
        svid: props.svid,
        scm_theme_color: themeColor,
        scm_position: iconConfig.position,
        scm_pc_display: iconConfig.pc.hide ? '0' : '1',
        scm_pc_x: iconConfig.pc.axisX,
        scm_pc_y: iconConfig.pc.axisY,
        scm_pc_width: iconConfig.pc.size,
        scm_mo_display: iconConfig.mobile.hide ? '0' : '1',
        scm_mo_x: iconConfig.mobile.axisX,
        scm_mo_y: iconConfig.mobile.axisY,
        scm_mo_width: iconConfig.mobile.size,
        scm_icon_text: iconConfig.text || '',
        scm_icon_text_align: iconConfig.textAlign || 'left'
      }
    )
  }, [iconConfig])


  React.useEffect(()=>{
    const _config = selectDevice == '0' ? iconConfig.pc : iconConfig.mobile

    setIconHide(_config.hide)
    setIconAxisX(_config.axisX)
    setIconAxisY(_config.axisY)
    setIconSize(_config.size)
  }, [selectDevice])

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
          <div>챗봇 설정</div>
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
                        if(code === "1"){
                          setUseChat(use)
                          setWorkingDay({...workingDay, isInit : false})
                        }
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
                profileImage={profileImage}
                iconPosition={iconPosition}
                iconAxisX={iconAxisX}
                iconAxisY={iconAxisY}
                iconSize={iconSize}
                device={selectDevice}
                text={iconText}
                textAlign={iconTextAlign}/>
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
                    disableAlpha={true}
                    color={themeColor}
                    onChange={(color) => {
                      const _color = color.rgb.a === 1 ? color.hex : `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
                      setThemeColor(_color)
                      onChangeIconConfig()
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
                  { profileImage !== null && (
                    <div className="setting-profile-image-remove"
                    onClick={() => { handleFileRemove() }}>이미지 삭제</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="setting-menu-column">
            <div className="setting-menu-tab">
              <div className={selectDevice === 0 ? 'active' : ''}
                onClick={() => {setSelectDevice(0)}}>PC</div>
              <div className={selectDevice === 1 ? 'active' : ''}
                onClick={() => {setSelectDevice(1)}}>Mobile</div>
            </div>
            <div className="setting-menu-device">
              <div>
                <div className="setting-menu-device-item">
                  <label>
                    <input type="checkbox"
                      checked={iconHide}
                      onChange={(e) => {
                        setIconHide(e.target.checked)
                        onChangeIconConfig({hide : e.target.checked})
                      }}/>
                    <span>채팅 아이콘 숨기기</span>
                  </label>
                </div>
                <div className="setting-menu-device-item">
                  <div className="setting-menu-device-item-title">아이콘 위치</div>
                  <div className="row">
                    <div className="screen-axis">
                      <div className={iconPosition === 'lt' ? "screen-axis-lt active" : "screen-axis-lt"}
                           onClick={() => {
                             setIconPosition('lt')
                             onChangeIconConfig({position: 'lt' })
                           }}></div>
                      <div className={iconPosition === 'rt' ? "screen-axis-rt active" : "screen-axis-rt"}
                           onClick={() => {
                             setIconPosition('rt')
                             onChangeIconConfig({position: 'rt' })
                           }}></div>
                      <div className={iconPosition === 'lb' ? "screen-axis-lb active" : "screen-axis-lb"}
                           onClick={() => {
                             setIconPosition('lb')
                             onChangeIconConfig({position: 'lb' })
                           }}></div>
                      <div className={iconPosition === 'rb' ? "screen-axis-rb active" : "screen-axis-rb"}
                           onClick={() => {
                             setIconPosition('rb')
                             onChangeIconConfig({position: 'rb' })
                           }}></div>
                    </div>
                    <div style={{width: 300, marginLeft: 50}}>
                      <div className="row">
                        <div className="setting-menu-device-item-title">가로 여백</div>
                        <PrettoSlider
                          // defaultValue={15}
                          step={1}
                          min={0}
                          max={100}
                          valueLabelDisplay="auto"
                          value={iconAxisX}
                          onChange={(event, value) => {
                            setIconAxisX(value)
                          }}
                          onChangeCommitted={(e, v)=>{
                            onChangeIconConfig()
                          }}
                        />
                      </div>
                      <div className="row">
                        <div className="setting-menu-device-item-title">세로 여백</div>
                        <PrettoSlider
                          // defaultValue={15}
                          step={1}
                          min={0}
                          max={100}
                          valueLabelDisplay="auto"
                          value={iconAxisY}
                          onChange={(event, value) => {
                            setIconAxisY(value)
                          }}
                          onChangeCommitted={(e, v)=>{
                            onChangeIconConfig()
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="setting-menu-device-item">
                  <div className="setting-menu-device-item-title">아이콘 크기</div>
                  <div style={{width: 250}}>
                    <PrettoSlider
                      defaultValue={60}
                      step={1}
                      min={50}
                      max={80}
                      valueLabelDisplay="auto"
                      value={iconSize}
                      onChange={(event, value) => {
                        setIconSize(value)
                      }}
                      onChangeCommitted={(e, v)=>{
                        onChangeIconConfig()
                      }}
                    />
                  </div>
                </div>
                {selectDevice === 0 && (
                  <div className="setting-menu-device-item">
                    <div className="setting-menu-device-item-title">아이콘 텍스트</div>
                    <div className="setting-input-item" style={{margin: 0}}>
                      <input value={iconText || ''}
                        placeholder="채팅 상담"
                        onBlur={(e) => onChangeIconConfig({text: e.target.value})}
                        onChange={(e) => { setIconText(e.target.value) }}/>
                    </div>
                    {iconText && iconText !== '' && (
                      <div className="setting-menu-device-item-input-radio">
                        <label>
                          <input type="radio"
                            name="icon-text-align"
                            checked={iconTextAlign !== 'right'}
                            onChange={(e) => {
                              const checked = e.target.checked
                              if (checked) {
                                setIconTextAlign('left')
                                onChangeIconConfig({textAlign: 'left'})
                              }
                            }}/>
                          <span>왼쪽</span>
                        </label>
                        <label>
                          <input type="radio"
                            name="icon-text-align"
                            checked={iconTextAlign === 'right'}
                            onChange={(e) => {
                              const checked = e.target.checked
                              if (checked) {
                                setIconTextAlign('right')
                                onChangeIconConfig({textAlign: 'right'})
                              }
                            }}/>
                          <span>오른쪽</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}
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
          <div className="setting-menu-header">
            챗봇 설정
          </div>
          <div className="setting-menu-body" style={{flexDirection : "column"}}>
            <div className="setting-checkbox-item">
              <div className="setting-checkbox-item-title">
                <label>
                  <input type="checkbox"
                         checked={chatbotState !== '0'}
                         onChange={(e) => {
                           setChatbotState(e.target.checked ? '1' : '0')
                         }}/>
                  <span>챗봇기능 사용</span>
                </label>

                {chatbotState !== '0' && (
                  <div
                    className="chatbot-config"
                    style={{
                    margin: '13px 0 0 25px'
                  }}>
                    <label>
                      <input type="radio"
                             name="chat_active_time"
                             checked={chatbotState === '1'}
                             onChange={(e) => {
                               setChatbotState('1')
                             }}/>
                      <span>24시간</span>
                    </label>
                    <label>
                      <input type="radio"
                             name="chat_active_time"
                             checked={chatbotState === '2'}
                             onChange={(e) => {
                               setChatbotState('2')
                             }}/>
                      <span>채팅 운영시간</span>
                    </label>
                    <label>
                      <input type="radio"
                             name="chat_active_time"
                             checked={chatbotState === '3'}
                             onChange={(e) => {
                               setChatbotState('3')
                             }}/>
                      <span>채팅 비운영시간</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                fontSize: '16px',
                display: 'flex'
              }}>
              <div>
                <span
                className="init-chatbot-btn"
                onClick={() => resetChatbotList()}>초기화</span>
                <span
                  className="save-chatbot-btn"
                  onClick={() => saveChatbotConfig()}>저장</span>
              </div>

              <div
                style={{
                  marginLeft: '235px',
                }}
              >
                <div
                  onClick={()=> {
                    setShowChatbotTemplate(true)
                  }}>템플릿</div>
                <div
                  onClick={()=> {
                    setShowChatbotPreview(true)
                  }}
                >미리보기</div>
              </div>
            </div>


            <div className="chatbot-list">
              {chatbotList.map((chatbot, index) => (
                <Chatbot
                  key={chatbot.id}
                  {...chatbot}
                  isLoading={isLoading}
                  index={index}
                  chatbotList={chatbotList}
                  updateChatbot={(newChatbot) => {
                    setChatbotList([
                      ...chatbotList.slice(0, index),
                      newChatbot,
                      ...chatbotList.slice(index + 1)
                    ])
                  }}
                  deleteChatbot={() => {
                    const deleted = chatbotList[index]
                    chatbotList.forEach(chatbot => {
                      chatbot.answers?.forEach(t => t.to = t.to === deleted.id
                        ? ''
                        : t.to)
                    })

                    setChatbotList([
                      ...chatbotList.slice(0, index),
                      ...chatbotList.slice(index + 1)
                    ])
                  }}
                  nickname={nickname}
                  profileImage={profileImage}
                />
              ))}
              <div
                className="add-chatbot-btn"
                onClick={() => {
                  const newChatbot = {
                    id: script.genId(),
                    title: '제목',
                    answers: [
                      {
                        message: '내용을 입력해주세요.',
                        to: ''
                      }
                    ],
                    questions: [
                      {
                        message: '내용을 입력해주세요.',
                        type: 1
                      }
                    ],
                    action: ''
                  }
                  setChatbotList([...chatbotList, newChatbot])
                }}>
                추가
              </div>
            </div>
          </div>
        </div>
      </div>


      {showChatbotTemplate && (
        <div
          style={{
            position: 'fixed',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            display : 'flex',
            alignItems : 'center',
            justifyContent : 'center',
            backgroundColor: '#0000004d'
          }}>
          <div
            className="chatbot-template-modal"
            style={{
              zIndex: '10000',
              border: '1px solid #b6b6b6',
              backgroundColor: 'white',
              position: 'fixed',
              width : '900px',
              height : '65%',
              borderRadius: '10px'
            }}>
            <div
              className="chatbot-close"
              onClick={() => setShowChatbotTemplate(false)}>
              <i className="chatbot-close-icon"></i>
            </div>

            <div style={{
              display: 'flex',
              height: '100%'
            }}>
              <div style={{
                flex : '1',
                borderRight : '1px solid rgba(0, 0, 0, 0.12)',
                height : '100%',
                display : 'flex',
                flexFlow : 'column',
              }}>
                <div style={{
                  textAlign : 'center',
                  margin : '16px',
                }}>
                  템플릿
                </div>
                <div style={{overflow:'auto'}}>
                  {chatbotTemplate.map((template, index) => (
                    <div
                      className="chatbot-template"
                      key={index}
                      style={{
                        ...(seletedTemplate === template
                          ? { backgroundColor: '#0075ff0d' }
                          : undefined),
                        margin: '15px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transitionProperty: 'background',
                        transitionDuration: '0.2s'
                      }}
                      onClick={() => {
                        setSeletedTemplate(template)
                      }}>
                      <div
                        className="chatbot-name"
                        style={{
                          textAlign: 'left',
                          padding: '5px 0 0 20px',
                          fontSize: '20px'
                        }}>
                        {template.name}
                      </div>
                      <div
                        className="chatbot-description"
                        style={{
                          color: '#000000ba',
                          fontSize: '13px',
                          textAlign: 'left',
                          padding: '10px'
                        }}>
                        {template.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                width:'420px'
                // flex: '1'
              }}>
                {seletedTemplate && (<div style={{
                    display: 'flex',
                    flexFlow: 'column',
                    height: '100%',
                    width: '100%',
                  }}>
                    <div
                      onClick={() => {
                        addChatbotFromTemplate(seletedTemplate.list)
                        setShowChatbotTemplate(false)
                      }}
                      style={{
                        alignSelf : 'center',
                        width : '122px',
                        textAlign : 'center',
                        borderRadius : '10px',
                        backgroundColor : '#0080F7',
                        color : 'white',
                        fontSize : '16px',
                        margin : '18px',
                        cursor: 'pointer',
                      }}>
                      적용하기
                    </div>

                    {seletedTemplate && (
                      <ChatbotPreview
                        showImageViewer={props.showImageViewer}
                        profileImage={profileImage}
                        list={seletedTemplate.list}>
                      </ChatbotPreview>
                    )}
                  </div>)}
              </div>
            </div>


          </div>
        </div>
      )}

      {showChatbotPreview && (
        <div
          onKeyDown={()=> console.log(1)}
          className="chatbot-test-modal"
          style={{
            position: 'fixed',
            display : 'flex',
            alignItems : 'center',
            justifyContent : 'center',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            backgroundColor: '#0000004d'
          }}>
          <div
            className="chatbot-test-modal-contents"
            style={{
            zIndex : '10000',
            border : '1px solid rgb(182, 182, 182)',
            backgroundColor : 'white',
            position : 'fixed',
            width : '400px',
            height : '640px',
            borderRadius: '10px',
          }}>
            <div style={{
              padding: '10px 0 10px 10px',
              height: '100%'
            }}>
              <div
                className="chatbot-close"
                onClick={() => setShowChatbotPreview(false)}>
                <i className="chatbot-close-icon"></i>
              </div>
              <ChatbotPreview
                showImageViewer={props.showImageViewer}
                profileImage={profileImage}
                list={chatbotList}>
              </ChatbotPreview>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  settings: state.settings
})

// export default Setting
export default connect(mapStateToProps)(Setting)
