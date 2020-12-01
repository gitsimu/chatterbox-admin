import React from 'react';
import ChatbotQuestionText from './ChatbotQuestionText'
import ChatbotQuestionSimpleImage from './ChatbotQuestionSimpleImage'
import ChatbotQuestionLink from './ChatbotQuestionLink'

const ChatbotQuestion = ({index, type, message, isLoading, onClickSave, onClickDelete, ...props}) => {

  return (
    <>
      {type === 1 && (
        <ChatbotQuestionText
          message={message}
          onClickDelete={onClickDelete}
          onClickSave={onClickSave}
        />
      )}

      {type === 3 && (
        <ChatbotQuestionSimpleImage
          message={message}
          isLoading={isLoading}
          onClickDelete={onClickDelete}
          onClickSave={onClickSave}
        />
      )}

      {type === 4 && (
        <ChatbotQuestionLink
          message={message}
          onClickDelete={onClickDelete}
          onClickSave={onClickSave}
        />
      )}
    </>
  );
}

export default ChatbotQuestion