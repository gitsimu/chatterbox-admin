import React from 'react';

const COLOR = ['#6dd2eb', '#7fc1e3', '#53a8dd', '#3f92d8', '#588ac7', '#4374c6', '#2c50c3', '#4d61b8', '#3b50a9', '#26398c', '#091c6f']
const ChatbotTitleIcon = ({ index }) => (
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
export default ChatbotTitleIcon