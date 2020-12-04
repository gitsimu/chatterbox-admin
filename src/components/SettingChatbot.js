import React from 'react'
import { connect } from 'react-redux'
import Chatbot from './Chatbot'
import * as script from '../js/script'

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

const SettingChatbot = ({...props}) => {
  const [chatbotState, setChatbotState] = React.useState(props.chatbotState)
  const [chatbotList, dispatch] = React.useReducer(reducer, props.chatbotList);

  React.useEffect(() => {
    dispatch({type : 'INIT', value: props.chatbotList})
  }, [props.chatbotList])

  const saveChatbot = ()=> {
    console.log(chatbotState, chatbotList)
    props.saveChatbot(chatbotState, chatbotList)
  }

  const addChatbot = () => {
    const newChatbot = genNewChatbot()
    dispatch({type : 'ADD', value : newChatbot})
  }

  const updateChatbot = React.useCallback((index, newChatbot) => {
    dispatch({type: 'UPDATE', index: index, value: newChatbot})
  }, [])

  const deleteChatbot = React.useCallback((index) => {
    dispatch({type: 'DELETE', index: index })
  }, [])

  const genNewChatbot = () => (
    {
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
  )

  return (
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
      <div className="chatbot-config-btn-area">
        <div
          className="init-chatbot-btn"
          onClick={props.resetChatbotList}>초기화</div>
        <div
          className="save-chatbot-btn"
          onClick={saveChatbot}>저장</div>
        <div
          style={{
            marginLeft: '127px'
          }}
          onClick={()=>props.setShowChatbotTemplate(true)}>템플릿</div>
        <div
          onClick={()=>props.setPreviewChatbot(chatbotList)}
        >미리보기</div>
      </div>


      <div className="chatbot-list">
        {chatbotList.map((chatbot, index) => (
          <Chatbot
            key={chatbot.id}
            {...chatbot}
            isLoading={props.isLoading}
            index={index}
            chatbotList={chatbotList}
            updateChatbot={updateChatbot}
            deleteChatbot={deleteChatbot}
            nickname={props.nickname}
            profileImage={props.profileImage}
          />
        ))}
        <div
          className="add-chatbot-btn"
          onClick={addChatbot}>
          추가
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
)(SettingChatbot);