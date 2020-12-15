import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { ChromePicker } from 'react-color'
import PrettoSlider from './PrettoSlider'
import * as smlog from '../js/smlog'
import * as script from '../js/script'
import Mockup from './Mockup'
import ChatbotPreview from './ChatbotPreview'
import useImageUpload from '../hooks/useImageUpload'
import SettingChatbot from './SettingChatbot'

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
    list : (()=>{
      const chatId = script.genId()
      return [
        {id: script.genId(), title: '처음으로', questions: [{message: '안녕하세요 챗봇입니다.', type: 1}, {message: '궁금한 사항을 선택해주세요.', type: 1}], answers: [{message:'상담원 연결', to: chatId}]},
        {id: chatId, title: '상담원 연결', questions: [{message: '상담원을 연결해드리겠습니다.', type: 1}], answers: [], action: 'CHAT'},
      ]
    })()
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
    name: '챗봇으로 업무량 줄이기',
    description: '자주 묻는 문의가 많은 경우, 자동으로 답변하여 업무량을 줄이세요.',
    list: [
      {
        "action": "",
        "answers": [
          {
            "chosen": false,
            "message": "요금 안내",
            "to": "1606364736968"
          },
          {
            "chosen": false,
            "message": "서비스 안내",
            "to": "1606364811544"
          },
          {
            "message": "배송 안내",
            "to": "1606364859716"
          },
          {
            "chosen": false,
            "message": "이벤트 안내",
            "to": "1606364887556"
          },
          {
            "message": "상담원 연결",
            "to": "CHAT"
          }
        ],
        "id": "START",
        "questions": [
          {
            "message": "안녕하세요.\n[회사명] 챗봇입니다 :)\n궁금한 사항을 선택해주세요.\n\n상담원 연결 가능 시간\n평일 00시 ~ 00시\n점심 00시 ~ 00시",
            "type": 1,
          }
        ],
        "title": "처음으로"
      },
      {
        "action": "CHAT",
        "id": "CHAT",
        "questions": [
          {
            "message": "상담원을 연결해드리겠습니다.",
            "type": 1,
          }
        ],
        'answers': [],
        "title": "상담원 연결"
      },
      {
        "action": "",
        "answers": [
          {
            "message": "처음으로",
            "to": "START"
          }
        ],
        "id": "1606364736968",
        "questions": [
          {
            "message": "요금 안내입니다.\n\nA TYPE은 5만원\nB TYPE은 10만원입니다.\n\n* 멘트를 수정하세요",
            "type": 1,
          }
        ],
        "title": "요금 안내"
      },
      {
        "action": "",
        "answers": [
          {
            "message": "A TYPE",
            "to": "1606364910237"
          },
          {
            "message": "B TYPE",
            "to": "1606364956481"
          },
          {
            "message": "처음으로",
            "to": "START"
          }
        ],
        "id": "1606364811544",
        "questions": [
          {
            "message": "서비스 종류를 선택해 주세요.",
            "type": 1,
          }
        ],
        "title": "서비스 안내"
      },
      {
        "action": "",
        "answers": [
          {
            "message": "처음으로",
            "to": "START"
          }
        ],
        "id": "1606364859716",
        "questions": [
          {
            "message": "배송 안내입니다.\n\n영업일 오전 00시 이전에 접수된 주문은 대략 00일에서 00일 사이에 배송되며, 주말과 국경일은 제외됩니다.",
            "type": 1,
          },
          {
            "message": "영업일 오전 00시 이후 또는 공휴일에 접수된 주문, 도서, 산간 지역의 경우에는 1~2일이 추가로 소요될 수 있습니다.",
            "type": 1,
          }
        ],
        "title": "배송 안내"
      },
      {
        "action": "",
        "answers": [
          {
            "message": "처음으로",
            "to": "START"
          }
        ],
        "id": "1606364887556",
        "questions": [
          {
            "message": "이벤트 안내입니다.",
            "type": 1,
          },
          {
            "message": "신규 가입자 분에게\n20% 할인쿠폰을 제공해 드리고 있습니다.\n\n자세한 내용은 아래\n[이벤트 보러 가기] 버튼을 눌러주세요.\n\n*아래 버튼 링크를 수정해주세요",
            "type": 1,
          },
          {
            "message": "{\"text\":\"이벤트 보러 가기\",\"url\":\"https://smlog.co.kr\"}",
            "type": 4,
          }
        ],
        "title": "이벤트 안내"
      },
      {
        "action": "",
        "answers": [
          {
            "message": "처음으로",
            "to": "START"
          },
          {
            "message": "서비스 안내",
            "to": "1606364811544"
          }
        ],
        "id": "1606364910237",
        "questions": [
          {
            "message": "A TYPE에 대한 안내입니다.",
            "type": 1,
          }
        ],
        "title": "A TYPE"
      },
      {
        "id": "1606364956481",
        "title": "B TYPE",
        "answers": [
          {
            "chosen": false,
            "message": "처음으로",
            "selected": false,
            "to": "START"
          },
          {
            "chosen": false,
            "message": "서비스 안내",
            "selected": false,
            "to": "1606364811544"
          }
        ],
        "questions": [
          {
            "message": "B TYPE에 대한 안내입니다.",
            "type": 1,
          }
        ],
        "action": "",
        "j": 0
      }
    ]
  },
  {
    name: '퇴근 후 챗봇으로 자동응대',
    description: '업무시간이 종료되어도, 자동으로 답변하여 고객 만족도를 향상 시켜보세요.',
    list : [
      {
        "id": "START",
        "title": "처음으로",
        "answers": [
          {
            "chosen": false,
            "message": "요금 안내",
            "to": "1606364736968"
          },
          {
            "chosen": false,
            "message": "서비스 안내",
            "to": "1606364811544"
          },
          {
            "message": "배송 안내",
            "to": "1606364859716"
          },
          {
            "chosen": false,
            "message": "이벤트 안내",
            "to": "1606364887556"
          },
          {
            "message": "1:1 문의",
            "to": "6daj5ntbe"
          }
        ],
        "questions": [
          {
            "message": "안녕하세요.\n[회사명] 챗봇입니다 :)\n\n지금은 상담원 연결이 불가능합니다.\n[상담원 연결 가능 시간]\n평일 00시 ~ 00시\n점심 00시 ~ 00시\n\n궁금한 사항을 선택하시면\n챗봇이 알려드리겠습니다.",
            "type": 1
          }
        ],
        "action": ""
      },
      {
        "id": "CHAT",
        "title": "상담원 연결",
        "questions": [
          {
            "message": "상담원을 연결해드리겠습니다.",
            "type": 1
          }
        ],
        'answers': [],
        "action": "CHAT"
      },
      {
        "id": "1606364736968",
        "title": "요금 안내",
        "answers": [
          {
            "message": "처음으로",
            "to": "START"
          }
        ],
        "questions": [
          {
            "message": "요금 안내입니다.\n\nA TYPE은 5만원\nB TYPE은 10만원입니다.\n\n* 멘트를 수정하세요",
            "type": 1
          }
        ],
        "action": ""
      },
      {
        "id": "1606364811544",
        "title": "서비스 안내",
        "answers": [
          {
            "message": "A TYPE",
            "to": "1606364910237"
          },
          {
            "message": "B TYPE",
            "to": "1606364956481"
          },
          {
            "message": "처음으로",
            "to": "START"
          }
        ],
        "questions": [
          {
            "message": "서비스 종류를 선택해 주세요.",
            "type": 1
          }
        ],
        "action": ""
      },
      {
        "id": "1606364859716",
        "title": "배송 안내",
        "answers": [
          {
            "message": "처음으로",
            "to": "START"
          }
        ],
        "questions": [
          {
            "message": "배송 안내입니다.\n\n영업일 오전 00시 이전에 접수된 주문은 대략 00일에서 00일 사이에 배송되며, 주말과 국경일은 제외됩니다.",
            "type": 1
          },
          {
            "message": "영업일 오전 00시 이후 또는 공휴일에 접수된 주문, 도서, 산간 지역의 경우에는 1~2일이 추가로 소요될 수 있습니다.",
            "type": 1
          }
        ],
        "action": ""
      },
      {
        "id": "1606364887556",
        "title": "이벤트 안내",
        "answers": [
          {
            "message": "처음으로",
            "to": "START"
          }
        ],
        "questions": [
          {
            "message": "이벤트 안내입니다.",
            "type": 1
          },
          {
            "message": "신규 가입자 분에게\n20% 할인쿠폰을 제공해 드리고 있습니다.\n\n자세한 내용은 아래\n[이벤트 보러 가기] 버튼을 눌러주세요.\n\n*아래 버튼 링크를 수정해주세요",
            "type": 1
          },
          {
            "message": "{\"text\":\"이벤트 보러 가기\",\"url\":\"https://smlog.co.kr\"}",
            "type": 4
          }
        ],
        "action": ""
      },
      {
        "id": "1606364910237",
        "title": "A TYPE",
        "answers": [
          {
            "message": "처음으로",
            "to": "START"
          },
          {
            "message": "서비스 안내",
            "to": "1606364811544"
          }
        ],
        "questions": [
          {
            "message": "A TYPE에 대한 안내입니다.",
            "type": 1
          }
        ],
        "action": ""
      },
      {
        "id": "1606364956481",
        "title": "B TYPE",
        "answers": [
          {
            "chosen": false,
            "message": "처음으로",
            "selected": false,
            "to": "START"
          },
          {
            "chosen": false,
            "message": "서비스 안내",
            "selected": false,
            "to": "1606364811544"
          }
        ],
        "questions": [
          {
            "message": "B TYPE에 대한 안내입니다.",
            "type": 1
          }
        ],
        "action": ""
      },
      {
        "id": "6daj5ntbe",
        "title": "1:1 문의",
        "answers": [
          {
            "message": "처음으로",
            "to": "START"
          }
        ],
        "questions": [
          {
            "message": "아래 버튼을 클릭하시면\n1:1 문의 게시판으로 이동합니다.",
            "type": 1
          },
          {
            "message": "{\"text\":\"1:1 문의 게시판 바로가기\",\"url\":\"https://smlog.co.kr\"}",
            "type": 4
          }
        ],
        "action": ""
      }
    ]
  },
  {
    name: '이벤트 안내로 구매 유도',
    description: '진행중인 이벤트를 홍보하여, 구매 전환률을 상승 시킵니다.',
    list: [
      {
        "id": "START",
        "title": "처음으로",
        "answers": [
          {
            "message": "신규 회원 2000원 적립금 지급",
            "to": "1606364887556"
          },
          {
            "message": "아우터 카테고리 20% 할인 이벤트",
            "to": "lmzsjooy0"
          },
          {
            "message": "SNS 공유 이벤트",
            "to": "vucljw5pn"
          }
        ],
        "questions": [
          {
            "message": "안녕하세요.\nOO 쇼핑몰입니다 :)\n\n현재 OO 이벤트를 진행중에 있습니다.\n\n자세한 이벤트 내용은\n아래 버튼을 클릭해주세요.",
            "type": 1
          }
        ],
        "action": ""
      },
      {
        "id": "CHAT",
        "title": "상담원 연결",
        "answers": [],
        "questions": [
          {
            "message": "상담원을 연결해드리겠습니다.",
            "type": 1
          }
        ],
        "action": "CHAT"
      },
      {
        "id": "1606364887556",
        "title": "신규 회원",
        "answers": [
          {
            "message": "처음으로",
            "to": "START"
          }
        ],
        "questions": [
          {
            "message": "신규 회원 가입시\n2000원 적립금을 지급하고 있습니다.",
            "type": 1
          },
          {
            "message": "자세한 내용은 아래\n[이벤트 보러 가기] 버튼을 눌러주세요.\n\n*아래 버튼 링크를 수정해주세요",
            "type": 1
          },
          {
            "message": "{\"text\":\"이벤트 보러 가기\",\"url\":\"https://smlog.co.kr\"}",
            "type": 4
          }
        ],
        "action": ""
      },
      {
        "id": "lmzsjooy0",
        "title": "20% 할인",
        "answers": [
          {
            "message": "처음으로",
            "to": "START"
          }
        ],
        "questions": [
          {
            "message": "아우터 카테고리 20% 할인 이벤트",
            "type": 1
          },
          {
            "message": "이벤트 내용입니다.",
            "type": 1
          },
          {
            "message": "{\"text\":\"이벤트 보러 가기\",\"url\":\"https://smlog.co.kr\"}",
            "type": 4
          }
        ],
        "action": ""
      },
      {
        "id": "vucljw5pn",
        "title": "SNS 공유",
        "answers": [
          {
            "message": "처음으로",
            "to": "START"
          }
        ],
        "questions": [
          {
            "message": "SNS 공유 이벤트",
            "type": 1
          },
          {
            "message": "블로그나 인스타그램에\n저희 쇼핑몰에서 구매한 상품을 착용 하신 후,\n후기를 남겨주시면\n적립금 2천원을 적립해 드립니다!",
            "type": 1
          },
          {
            "chosen": false,
            "message": "SNS에 후기를 남겨 주신 후,\n아래 게시판에 URL을 남겨주세요",
            "type": 1
          },
          {
            "message": "{\"text\":\"후기 작성 후 적립금 요청하기\",\"url\":\"https://smlog.co.kr\"}",
            "type": 4
          }
        ],
        "action": ""
      }
    ]
  }
]

const Setting = ({ _key : key, database, isLoading, ...props }) => {
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
  const [chatbotList, setChatbotList] = React.useState(null)
  const [chatbotState, setChatbotState] = React.useState(null)
  const [showChatbotTemplate, setShowChatbotTemplate] = React.useState(false)
  const [seletedTemplate, setSeletedTemplate] = React.useState(null)
  const [previewChatbot, setPreviewChatbot] = React.useState(null)

  let [uploadImage] = useImageUpload()

  const [initAfter, setInitAfter] = React.useState(false)

  const setChatbotConfig = (chatbotConfig) => {
    if(!chatbotConfig) chatbotConfig = initConfig.chatbot

    setChatbotState(chatbotConfig.state)
    chatbotListOrigin.current = chatbotConfig.list
    resetChatbotList()
  }

  const resetChatbotList= React.useCallback(() => {
    setChatbotList(JSON.parse(JSON.stringify(chatbotListOrigin.current)))
  }, [])

  const applyChatbotTemplate = (_list) => {
    const list = JSON.parse(JSON.stringify(_list))
    const answersAll = list.reduce((a,b)=> [...a, ...b.answers], [])

    list.forEach(chatbot=> {
      const oldId = chatbot.id
      const newId = chatbot.id = script.genId()

      answersAll.forEach(answer => {
        if(answer.to !== oldId) return
        answer.to = newId
      })
    })

    setChatbotList(list)
  }

  const saveChatbot = React.useCallback((newChatbotState, newChatbotList) => {
    const hasEmptyQuestions = newChatbotList.some(chatbot=> !chatbot.questions?.length)
    if(hasEmptyQuestions){
      alert("메시지가 없는 챗봇이 있습니다.")
      return
    }
    const hasEmptyAnswers = newChatbotList.some(chatbot=> chatbot.action !== "CHAT" && !chatbot.answers?.length)
    if(hasEmptyAnswers){
      alert("버튼이 없는 챗봇이 있습니다.")
      return
    }
    const hasEmptyLink = newChatbotList.some(chatbot=> chatbot.answers?.some(answer=> !answer.to) || false)
    if(hasEmptyLink){
      alert('챗봇에 연결되지 않은 버튼이 있습니다.')
      return
    }

    isLoading(true)

    const updateDB = smlog.API({
      method: 'update_chatbot_config',
      svid: props.svid,
      state : newChatbotState
    })
    const updateFirebase = database.ref(`/${key}/config/chatbot`)
      .update({
        state: newChatbotState,
        list: newChatbotList
      })

    Promise.all([updateDB, updateFirebase])
      .then(()=> {
        chatbotListOrigin.current = newChatbotList
      })
      .finally(()=> isLoading(false))
  }, [props.svid])

  React.useEffect(() => {
    const getFirebase = database.ref(`/${key}/config`).once('value')
    const getDb =  smlog.API({
      method: 'get_chat_config',
      svid: props.svid
    })

    Promise.all([getFirebase, getDb])
      .then(([snapshot, dbData]) => {
        const firebaseData = snapshot.val()

        if (firebaseData) {
          setTitle(firebaseData.title || initConfig.title)
          setSubTitle(firebaseData.subTitle || initConfig.subTitle)
          setNickname(firebaseData.nickname || initConfig.nickname)
          setFirstMessage(firebaseData.firstMessage || initConfig.firstMessage)
          setThemeColor(firebaseData.themeColor || initConfig.themeColor)
          setProfileImage(firebaseData.profileImage || null)
          setMissedMessage(firebaseData.workingDay.message)
          setChatbotConfig(firebaseData.chatbot || initConfig.chatbot)
        } else {
          setTitle(initConfig.title)
          setSubTitle(initConfig.subTitle)
          setNickname(initConfig.nickname)
          setFirstMessage(initConfig.firstMessage)
          setThemeColor(initConfig.themeColor)
          setChatbotConfig(initConfig.chatbot)
        }

        if (dbData) {
          setWorkingDay({
            isInit: true,
            message: firebaseData
              ? firebaseData.workingDay.message
              : '',
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
            themeColor: firebaseData
              ? firebaseData.themeColor
              : initConfig.themeColor,
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
      .finally(() => setInitAfter(true))
  }, [database, key])

  const handleFileInput = e => {
    const target = e.target.files[0]

    Promise.resolve()
      .then(() => isLoading(true))
      .then(() => uploadImage(target, {'tag' : 'profile'}))
      .then(res => {
        const path = JSON.stringify(res.data.file)
        database.ref(`/${key}/config`).update({ profileImage: path })
        setProfileImage(path)
      })
      .catch(({ message }) => message && alert(message))
      .finally(() => isLoading(false))
  }

  /* file remove handler */
  const handleFileRemove = () => {
    if (profileImage === null) return

    database.ref(`/${key}/config`).update({ profileImage: null })
    setProfileImage(null)

    // s3 file remove
    const config = { headers: { 'content-type': 'multipart/form-data' } }
    const formData = new FormData()
    formData.append('filename', JSON.parse(profileImage).name)
    formData.append('key', key)

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
    database.ref(`/${key}/config`).update({
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

    database.ref(`/${key}/config`).update({
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

  }, [database, key, workingDay, useChat])

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

          {initAfter && (
            <SettingChatbot
              chatbotState={chatbotState}
              chatbotList={chatbotList}
              resetChatbotList={resetChatbotList}
              saveChatbot={saveChatbot}
              setShowChatbotTemplate={setShowChatbotTemplate}
              setPreviewChatbot={setPreviewChatbot}
              nickname={nickname}
              profileImage={profileImage}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>


      {showChatbotTemplate && (
        <div className="chatbot-template-modal-layer">
          <div className="chatbot-template-modal">
            <div
              className="chatbot-close"
              onClick={() => setShowChatbotTemplate(false)}>
              <i className="chatbot-close-icon"></i>
            </div>
            <div className="template-modal-header">
              <p>챗봇 템플릿</p>
              <span>챗봇이 처음이라면? 템플릿으로 시작해보세요.</span>
            </div>
            <div className="template-modal-body">
              <div className="template-body-left">
                {chatbotTemplate.map((template, index) => (
                  <div
                    className={`chatbot-template ${template === seletedTemplate ? 'active' : ''}`}
                    key={index}
                    onClick={() => {
                      setSeletedTemplate(template)
                    }}
                  >
                    <div className="chatbot-template-inner">
                      <div className="chatbot-name">{template.name}</div>
                      <div className="chatbot-description">{template.description}</div>
                    </div>
                    <i className="icon-arrow-right"/>
                  </div>
                ))}
              </div>
              <div className="template-body-right">
                <div className="template-preview">
                  {seletedTemplate && (
                    <ChatbotPreview
                      showImageViewer={props.showImageViewer}
                      profileImage={profileImage}
                      list={seletedTemplate.list}>
                    </ChatbotPreview>
                  )}
                </div>
                <div
                  className="template-btn-area"
                  onClick={() => {
                    applyChatbotTemplate(seletedTemplate.list)
                    setShowChatbotTemplate(false)
                  }}
                >
                  <i className="icon-magic-wand"/>
                  선택한 템플릿으로 챗봇 만들기
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewChatbot && (
        <div className="chatbot-test-modal">          
          <div className="chatbot-test-modal-header">
            미리보기
            <div
              className="chatbot-close"
              onClick={() => setPreviewChatbot(null)}>
              <i className="chatbot-close-icon"></i>
            </div>
          </div>
          <div className="chatbot-test-modal-contents">          
            <div>              
              <ChatbotPreview
                showImageViewer={props.showImageViewer}
                profileImage={profileImage}
                list={previewChatbot}>
              </ChatbotPreview>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  _key: state.settings.key
})

// export default Setting
export default connect(mapStateToProps)(Setting)
