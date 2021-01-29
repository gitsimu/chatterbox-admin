import React from 'react'
import { connect } from 'react-redux'
import Chatbot from './Chatbot'
import * as script from '../js/script'
import ChatbotPreview from './ChatbotPreview'

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

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.value];
    case 'UPDATE':
      return [
        ...state.slice(0, action.index),
        action.value,
        ...state.slice(action.index + 1)
      ];
    case 'DELETE':
      const deleted = state[action.index]
      state.forEach(chatbot => {
        chatbot.answers
          ?.filter(t=> t.to === deleted.id)
          .forEach(t => (t.to = ''))
      })
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ]
    case 'INIT':
      return action.value
    default:
      throw new Error();
  }
}

const SettingChatbot = ({chatbotConfig, updateChatbotConfig, showImageViewer, isLoading, nickname, profileImage}) => {
  const [chatbotState, setChatbotState] = React.useState(chatbotConfig.state)
  const [chatbotList, dispatch] = React.useReducer(reducer, chatbotConfig.list);
  const [previewChatbot, setPreviewChatbot] = React.useState(false)
  const [showChatbotTemplate, setShowChatbotTemplate] = React.useState(false)
  const [seletedTemplate, setSeletedTemplate] = React.useState(chatbotTemplate[0])
  const oldList = React.useRef(chatbotConfig.list)
  const previewRef = React.useRef(null)

  const initChatbotList = () => {
    const list = JSON.parse(JSON.stringify(oldList.current))
    dispatch({type : 'INIT', value: list})
  }

  const addChatbot = () => {
    const newChatbot = genNewChatbot()
    dispatch({type : 'ADD', value : newChatbot})
  }

  const updateChatbot = React.useCallback((index, newChatbot) => {
    dispatch({type: 'UPDATE', index: index, value: newChatbot})
  }, [])

  const deleteChatbot = React.useCallback((index) => {
    if(!confirm('삭제하시겠습니까?')) return
    dispatch({type: 'DELETE', index: index })
  }, [])

  const handlerInvalid = (index) => {
    const invalidChatbot = chatbotList[index]
    const chatbotEl = document.getElementById(`chatbot_${invalidChatbot.id}`)
    chatbotEl.scrollIntoView({ block: 'center', inline: 'center', behavior : 'smooth'})

    updateChatbot(index, {
      ...invalidChatbot,
      invalid : true
    })
  }

  const saveChatbot = ()=> {
    let invalidChatbotIndex = -1

    invalidChatbotIndex = chatbotList.findIndex(chatbot=> !chatbot.questions?.length)
    if(invalidChatbotIndex > -1){
      alert("메시지가 없는 챗봇이 있습니다.")
      return handlerInvalid(invalidChatbotIndex)
    }
    invalidChatbotIndex = chatbotList.findIndex(chatbot=> chatbot.action !== "CHAT" && !chatbot.answers?.length)
    if(invalidChatbotIndex > -1){
      alert("버튼이 없는 챗봇이 있습니다.")
      return handlerInvalid(invalidChatbotIndex)
    }
    invalidChatbotIndex = chatbotList.findIndex(chatbot=> chatbot.answers?.some(answer=> !answer.to) || false)
    if(invalidChatbotIndex > -1){
      alert('챗봇에 연결되지 않은 버튼이 있습니다.')
      return handlerInvalid(invalidChatbotIndex)
    }

    const newConfig = {
      state: chatbotState,
      list : chatbotList
    }

    updateChatbotConfig(newConfig)
    oldList.current = chatbotList
  }

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

    dispatch({type : 'INIT', value: list})
  }

  const genNewChatbot = () => (
    {
      id: script.genId(),
      title: '제목을 입력해주세요.',
      answers: [
        {
          message: '답변을 연결해주세요.',
          to: ''
        }
      ],
      questions: [
        {
          message: '메시지를 입력해주세요.',
          type: 1
        }
      ],
      action: ''
    }
  )

  return (
    <>
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
          </div>
          {chatbotState !== '0' && (
            <>
              <div className="setting-checkbox-item-description">챗봇기능을 사용할 시간대를 선택해주세요.</div>
              <div className="setting-checkbox-item-description">해당 시간대에는 챗봇이 첫 응대를 하고, 그 외의 시간대엔 상담원에게 바로 연결됩니다.</div>
            </>
          )}

          {chatbotState !== '0' && (
              <div
                className="chatbot-config"
                style={{
                  margin: '0 0 0 25px'
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
        <div className="chatbot-config-btn-area">
          <div style={{color: '#009fff'}}
            onClick={()=>setShowChatbotTemplate(true)}>챗봇 템플릿</div>
          <div
            className="init-chatbot-btn"
            onClick={()=> {
              if(!confirm("초기화 하시겠습니까?")) return
              initChatbotList()
            }}>챗봇 초기화</div>
          <div
            onClick={()=> setPreviewChatbot(true)}
          >미리보기</div>
          <div
            className="save-chatbot-btn"
            onClick={saveChatbot}>저장하기</div>
        </div>


        <div className="chatbot-list">
          {(chatbotList || []).map((chatbot, index) => (
            <Chatbot
              key={chatbot.id}
              {...chatbot}
              isLoading={isLoading}
              index={index}
              chatbotList={chatbotList}
              updateChatbot={updateChatbot}
              deleteChatbot={deleteChatbot}
              nickname={nickname}
              profileImage={profileImage}
            />
          ))}
          <div
            className="add-chatbot-btn"
            onClick={addChatbot}>
            <span>+</span>
          </div>
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
                      if(template === seletedTemplate) {
                        previewRef.current.reset()
                      }
                      else {
                        setSeletedTemplate(template)
                      }
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
                      ref={previewRef}
                      showImageViewer={showImageViewer}
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
                showImageViewer={showImageViewer}
                profileImage={profileImage}
                list={chatbotList}>
              </ChatbotPreview>
            </div>
          </div>
        </div>
      )}
    </>
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
)(SettingChatbot);