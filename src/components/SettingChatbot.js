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
  const saveChatbot = ()=> {
    props.saveChatbot(chatbotState, chatbotList)
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
          onClick={()=>props.setShowChatbotTemplate(true)}>챗봇 템플릿</div>
        <div
          className="init-chatbot-btn"
          onClick={()=> {
            if(!confirm("초기화 하시겠습니까?")) return
            props.resetChatbotList()
          }}>챗봇 초기화</div>
        <div
          onClick={()=>props.setPreviewChatbot(chatbotList)}
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
          <span>+</span>
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