import React from 'react'
import useEventListener from '../hooks/useEventListener'
import ChatbotAnswer from './ChatbotAnswer'
import ChatbotTitleIcon from './ChatbotTitleIcon'
import ChatbotQuestion from './ChatbotQuestion'
import useImageUpload from '../hooks/useImageUpload'
import { ReactSortable } from 'react-sortablejs'

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return action.value
    case 'ADD':
      return [...state, action.value]
    case 'DELETE':
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ]
    case 'UPDATE':
      return [
        ...state.slice(0, action.index),
        action.value,
        ...state.slice(action.index + 1)
      ]
    default:
      throw new Error();
  }
}

const Chatbot = ({ id, action, isLoading, color, index, updateChatbot, deleteChatbot, chatbotList, ...props }) => {
  const titleRef = React.useRef()
  const [title, setTitle] = React.useState(props.title)
  const [questions, questionsDispatch] = React.useReducer(reducer, props.questions)
  const [answers, answersDispatch] = React.useReducer(reducer, props.answers)
  const [showAdd, setShowAdd] = React.useState(false)

  const [uploadImage] = useImageUpload()
  const { onClickOutside } = useEventListener()

  React.useEffect(() => {
    if(!showAdd) return
    const off = onClickOutside('.add-questions-list', ()=> setShowAdd(false))
    return ()=> {
      off()
    }
  }, [showAdd])

  React.useEffect(() => {
    titleRef.current.value = props.title
    setTitle(props.title)
    answersDispatch({type: 'INIT', value: props.answers})
    questionsDispatch({type : 'INIT', value: props.questions})
  }, [props.title, props.answers, props.questions])

  React.useEffect(() => {
    const newChatbot = {
      id : id,
      title : title,
      answers : answers || [],
      questions : questions,
      action : action || '',
    }

    updateChatbot(index, newChatbot)
  }, [answers, questions, title])

  const addQuestion = (newQuestion) => {
    questionsDispatch({type: 'ADD', value: newQuestion})
  }
  const deleteQuestion = React.useCallback((index) => {
    questionsDispatch({type: 'DELETE', index: index})
  }, [])

  const updateQuestion = React.useCallback((index, newQuestion) => {
    questionsDispatch({type : 'UPDATE', index: index, value: newQuestion})
  }, [])

  const addAnswer = (newAnswer) => {
    answersDispatch({type : 'ADD', value: newAnswer})
  }

  const deleteAnswer = React.useCallback((index) => {
    answersDispatch({type : 'DELETE', index : index})
  }, [])

  const updateAnswer = React.useCallback((index, newAnswer) => {
    answersDispatch({type : 'UPDATE', index: index, value: newAnswer})
  }, [])

  const handleFileInput = (e, file) => {
    const target = file || e.target.files[0]

    Promise.resolve()
      .then(()=> isLoading(true))
      .then(()=> uploadImage(target, {'tag' : 'chatbot'}))
      .then(res => {
        addQuestion({
          message: JSON.stringify(res.data.file),
          type: 3
        })
      })
      .catch(({ message }) => message && alert(message))
      .finally(()=> isLoading(false))
  }

  return (
    <div className="chatbot">
      <div className="chat-window" style={{
        position: 'static'
      }}>
        <div className="chat-window-header">
          <div
            className="chatbot-title-wrap">
            <ChatbotTitleIcon
              index={index}
            />
          </div>

          <input
            type="text"
            ref={titleRef}
            onBlur={()=> setTitle(titleRef.current.value)}
            name="edit-title"/>
          {index >= 2 && (
            <div
              className="chatbot-close"
              onClick={()=> deleteChatbot(index)}>
              <i className="chatbot-close-icon"/>
            </div>
          )}
        </div>

        <div
          className="chat-window-body"
          style={{
            position: 'static'
          }}
        >
          <ReactSortable
            handle=".sort-target"
            filter=".question-image-edit"
            list={questions}
            setList={newQuestions=> {
              if(newQuestions.every((q, i)=> q.message === questions[i].message)) return
              questionsDispatch({type: 'INIT', value: newQuestions})
            }}
          >
            {questions && questions.map((question, index) => (
              <div
                key={index}
                className="message opponent">

                <div className="message-profile">
                  {index === 0 && props.profileImage === null && (
                    <div className="message-profile-icon">
                      {props.nickname[0] || 'S'}
                    </div>
                  )}
                  {index === 0 && props.profileImage !== null && (
                    <div className="message-profile-image">
                      <img src={JSON.parse(props.profileImage).location}
                           alt="message-profile"/>
                    </div>
                  )}
                </div>
                <div className="message-body">
                  {(index === 0) && (
                    <div className="message-top">
                      <div className="message-name">{props.nickname}</div>
                    </div>
                  )}
                  <div className="message-bottom">
                    <ChatbotQuestion
                      index={index}
                      type={question.type}
                      message={question.message}
                      isLoading={isLoading}
                      onClickDelete={deleteQuestion}
                      onClickSave={updateQuestion}
                    />
                  </div>
                </div>
              </div>
            ))}
          </ReactSortable>

          <div className="message opponent">
            <div className="message-body">
              <div
                className="chatbot-button add-questions"
                onClick={() => {
                  setShowAdd(!showAdd)
                }}
              >
                + 메시지 추가
              </div>

              <div
                className="add-questions-list"
                style={{
                ...(!showAdd ? {display : 'none'} : undefined),
                position: 'absolute',
              }}>
                <div
                  onClick={()=> {
                    addQuestion({
                      message: '메시지를 입력해주세요.',
                      type: 1
                    })
                    setShowAdd(false)
                  }}
                  className="chatbot-button add-questions">텍스트</div>
                <div
                  onClick={(e) => {
                    document.querySelector(`[name=add-image_${index}]`).click()
                    setShowAdd(false)
                  }}
                  className="chatbot-button add-questions">
                  이미지
                  <input type="file"
                         accept="image/*"
                         name={`add-image_${index}`}
                         onClick={e => (e.target.value = '')}
                         onChange={e => {
                           handleFileInput(e)
                         }}
                         style={{ display: 'none' }}/>
                </div>
                <div
                  onClick={()=> {
                    addQuestion({
                      message: JSON.stringify({url : '', text: '버튼명을 입력해주세요.'}),
                      type: 4
                    })
                    setShowAdd(false)
                  }}
                  className="chatbot-button add-questions">링크
                </div>
              </div>
            </div>
          </div>

          {(action !== 'CHAT') && (
            <div className="message myself"
                 style={{ flexDirection: 'column' }}>
              <ReactSortable
                className="chatbot-answer-container"
                handle=".sort-target"
                list={answers}
                setList={newAnswers => {
                  if(newAnswers.every((a, i) => a.message === answers[i].message && a.to === answers[i].to)) return
                  answersDispatch({type: 'INIT', value: newAnswers})
                }}
              >
                {answers && answers?.map((answer, index) => (
                  <div key={index} className="chatbot-answer">
                    <ChatbotAnswer
                      key={index}
                      index={index}
                      chatbotId={id}
                      to={answer.to}
                      message={answer.message}
                      chatbotList={chatbotList}
                      onClickDelete={deleteAnswer}
                      onClickSave={updateAnswer}
                    />
                  </div>
                ))}
              </ReactSortable>
              <div
                className="chatbot-button add-answers"
                onClick={() => {
                  addAnswer({
                    message: '답변을 연결해주세요.', to: ''
                  })
                }}>+ 버튼 추가
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(Chatbot)