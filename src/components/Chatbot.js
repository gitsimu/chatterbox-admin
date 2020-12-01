import React from 'react'
import { useSelector } from 'react-redux'
import useClickOustside from '../hooks/useClickOustside'
import ChatbotAnswer from './ChatbotAnswer'
import ChatbotTitleIcon from './ChatbotTitleIcon'
import ChatbotQuestion from './ChatbotQuestion'
import useImageUpload from '../hooks/useImageUpload'
import { ReactSortable } from 'react-sortablejs'

const Chatbot = ({ id, title, answers, questions, action, isLoading, color, index, updateChatbot, deleteChatbot, chatbotList, ...props }) => {
  const { key } = useSelector(state => state.settings)

  const [showAdd, setShowAdd] = React.useState(false)
  const titleRef = React.useRef()

  const [uploadImage] = useImageUpload()
  useClickOustside(()=> setShowAdd(false), '.add-questions-list', showAdd)

  React.useEffect(() => {
    titleRef.current.value = title
  }, [title])

  const updateTitle = (newTitle) => {
    update({
      title: newTitle
    })
  }
  const addQuestion = (newQuestion) => {
    update({
      questions : [...questions, newQuestion]
    })
  }
  const deleteQuestion = (index) => {
    update({
      questions : [
        ...questions.slice(0, index),
        ...questions.slice(index + 1)
      ]
    })
  }
  const updateQuestion = (index, newQuestion) => {
    update({
      questions : [
        ...questions.slice(0, index),
        newQuestion,
        ...questions.slice(index + 1)
      ]
    })
  }

  const addAnswer = (newAnswer) => {
    update({
      answers:[...answers, newAnswer]
    })
  }
  const deleteAnswer = (index) => {
    update({
      answers: [
        ...answers.slice(0, index),
        ...answers.slice(index + 1)
      ]
    })
  }
  const updateAnswer = (index, newAnswer) => {
    update({
      answers:[
        ...answers.slice(0, index),
        newAnswer,
        ...answers.slice(index + 1)
      ]
    })
  }

  const update = (newVal) => {
    updateChatbot({
      id,
      title : title || '',
      answers : answers || [],
      questions : questions || [],
      action : action || '',
      ...newVal
    })
  }

  const handleFileInput = React.useCallback((e, file) => {
    const target = file || e.target.files[0]

    Promise.resolve()
      .then(()=> isLoading(true))
      .then(()=> uploadImage(target))
      .then(res => {
        addQuestion({
          message: JSON.stringify(res.data.file),
          type: 3
        })
      })
      .catch(({ message }) => message && alert(message))
      .finally(()=> isLoading(false))
  }, [key])

  return (
    <div className="chatbot">
      <div className="chat-window">
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
            onBlur={()=> updateTitle(titleRef.current.value)}
            name="edit-title"/>
          {index >= 2 && (
            <div
              className="chatbot-close"
              onClick={deleteChatbot}>
              <i className="chatbot-close-icon"/>
            </div>
          )}
        </div>

        <div className="chat-window-body">
          <ReactSortable
            draggable=".sort-target"
            list={questions}
            setList={newQuestions => update({ questions : newQuestions })}
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
                      onClickDelete={()=> deleteQuestion(index)}
                      onClickSave={newQuestion => updateQuestion(index, newQuestion)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </ReactSortable>

          <div className="message opponent">
            <div className="message-body">
              <div
                style={{
                  ...(showAdd ? {background: '1px solid #0000ff66'} : undefined)
                }}
                className="chatbot-button add-questions"
                onClick={() => {
                  setShowAdd(!showAdd)
                }}>+ 메시지 추가
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
                      message: '내용을 입력해주세요.',
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
                draggable=".sort-target"
                list={answers}
                setList={newAnswers => update({ answers : newAnswers })}
              >
                {answers && answers?.map((answer, index) => (
                  <div key={index}>
                    <ChatbotAnswer
                      key={index}
                      chatbotId={id}
                      to={answer.to}
                      message={answer.message}
                      chatbotList={chatbotList}
                      onClickDelete={() => deleteAnswer(index)}
                      onClickSave={(newAnswer) => updateAnswer(index, newAnswer)}
                    />
                  </div>
                ))}
              </ReactSortable>
              <div
                className="chatbot-button add-answers"
                onClick={() => {
                  addAnswer({
                    message: '내용을 입력해주세요.', to: ''
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

export default Chatbot