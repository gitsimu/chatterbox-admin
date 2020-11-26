import React from 'react'

const COLOR = ['#6dd2eb', '#7fc1e3', '#53a8dd', '#3f92d8', '#588ac7', '#4374c6', '#2c50c3', '#4d61b8', '#3b50a9', '#26398c', '#091c6f']

const Chatbot = ({ color, index, setChatbot, deleteChatbot, chatbotList, ...props }) => {

  const [questionsEditIndex, setQuestionsEditIndex] = React.useState(null)
  const [answersEditIndex, setAnswersEditIndex] = React.useState(null)
  const [chatbot, setTempChatbot] = React.useState(props.chatbot)

  /** @type {{current: HTMLTextAreaElement}} */
  const questionsEditText = React.useRef()
  /** @type {{current: HTMLTextAreaElement}} */
  const answersEditText = React.useRef()

  const id = props.chatbot.id
  const otherChatbot = chatbotList.filter(t => t.id !== id)

  const tempUpdate = (newVal) => {
    setTempChatbot({ ...chatbot, ...newVal })
  }

  const update = (newVal) => {
    setChatbot({ ...chatbot, ...newVal })
  }

  const titleIcon = (index) => (
    <span style={{
      backgroundColor: index === 0 ? COLOR[0] : COLOR[index%(COLOR.length - 1) + 1],
      padding: '5px 12px',
      color: 'white',
      borderRadius: '25px',
      fontSize: '11px',
    }}>
      {index === 0 ? '시작':`답변${index}`}
    </span>
  )

  React.useEffect(() => {
    if (questionsEditIndex == null) return
    setAnswersEditIndex(null)

    questionsEditText.current.value = chatbot.questions[questionsEditIndex].message
    questionsEditText.current.focus()
    questionsEditText.current.style.height = (questionsEditText.current.scrollHeight + 12) + 'px'
  }, [questionsEditIndex])

  React.useEffect(() => {
    if (answersEditIndex == null) return
    setQuestionsEditIndex(null)

    answersEditText.current.value = chatbot.answers[answersEditIndex].message
    answersEditText.current.focus()
    answersEditText.current.style.height = (answersEditText.current.scrollHeight + 12) + 'px'
  }, [answersEditIndex])

  React.useEffect(() => {
    setTempChatbot(props.chatbot)
    setAnswersEditIndex(null)
    setQuestionsEditIndex(null)
  }, [props.chatbot])

  return (
    <div className="chatbot">
      <div className="chat-window">
        <div className="chat-window-header">
          <div
            className="chatbot-title-wrap">
            {titleIcon(index)}
          </div>

          <input
            value={chatbot.title}
            onBlur={()=> update()}
            name="edit-title"
            onChange={(e) => tempUpdate({ title: e.target.value })}/>

          {index >= 2 && (
            <div
              className="chatbot-close"
              onClick={deleteChatbot}>
              <i className="chatbot-close-icon"/>
            </div>
          )}
        </div>

        <div className="chat-window-body">
          {chatbot.questions && chatbot.questions.map((question, index) => (
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
                  {questionsEditIndex !== index
                    ? (
                      <div
                        onClick={() => {
                          setQuestionsEditIndex(index)
                        }}
                        style={{ marginRight: '5px', cursor: 'pointer' }}
                        className="message-inner">
                        {question.message}
                      </div>
                    )
                    : (
                      <div className="message-edit">
                        <textarea
                          ref={questionsEditText}
                          onChange={(e) => {
                            e.target.style.height = 'auto'
                            e.target.style.height = `${e.target.scrollHeight + 12}px`
                          }}/>
                        <div className="flex-row">
                          <button
                            className="edit-button"
                            onClick={() => {
                              chatbot.questions.splice(index, 1)
                              update()
                            }}
                            style={{
                              color: 'red',
                              marginLeft: 'auto'
                            }}>삭제
                          </button>
                          <button
                            onClick={() => {
                              chatbot.questions[index].message = questionsEditText.current.value.trim()
                              setQuestionsEditIndex(null)
                              update()
                            }}
                            className="edit-button">저장
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}

          <div className="message opponent">
            <div className="message-body">
              <div
                className="chatbot-button add-questions"
                onClick={() => {
                  chatbot.questions.push({
                    message: '내용을 입력해주세요.',
                    type: 1
                  })
                  update()
                }}>+ 메시지 추가
              </div>
            </div>
          </div>

          {(chatbot.action !== 'CHAT') && (
            <div className="message myself"
                 style={{ flexDirection: 'column' }}>
              {chatbot.answers?.map((answer, index) => (
                <div key={index}>
                  {(answersEditIndex !== index)
                    ? (
                      <div
                        className="flex-row"
                        style={{
                          alignItems:'center'
                        }}>
                        <div
                          className="flex-row"
                          onClick={() => {
                            setAnswersEditIndex(index)
                          }}
                          style={{
                            cursor:'pointer'
                          }}>
                          <span className="chatbot-to-title">
                            {(i => i !== -1
                              ? titleIcon(i)
                              : <img src="/resources/link_off.png" alt=""/>
                            )(chatbotList.findIndex(t => t.id === answer.to))}
                          </span>
                          <div
                            className="chatbot-button">
                            {answer.message}
                          </div>
                        </div>
                        <i
                          onClick={() => {
                            chatbot.answers.splice(index, 1)
                            update()
                          }}
                          className="close-icon"/>
                      </div>
                    )
                    : (
                      <div className="message-edit">
                        <textarea
                          ref={answersEditText}
                          onChange={(e) => {
                            e.target.style.height = 'auto'
                            e.target.style.height = `${e.target.scrollHeight + 12}px`
                          }}
                        />
                        <div className="flex-row">
                          <select
                            className="chatbot-option"
                            value={answer.to}
                            onChange={(e) => {
                              chatbot.answers[index].to = e.target.value
                              tempUpdate()
                            }}>
                            {!answer.to && (
                              <option value="">선택하세요.</option>
                            )}
                            {otherChatbot.map(t => (
                              <option key={t.id}
                                      value={t.id}>{t.title}</option>
                            ))}
                          </select>
                          <button
                            className="edit-button"
                            style={{
                              marginLeft:'auto'
                            }}
                            onClick={() => {
                              chatbot.answers[index].message = answersEditText.current.value.trim()
                              update()
                              setAnswersEditIndex(null)
                            }}>저장
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              ))}

              <div
                className="chatbot-button add-answers"
                onClick={() => {
                  chatbot.answers.push({
                    message: '내용을 입력해주세요.', to: ''
                  })
                  update()
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