import React from 'react';
import * as script from '../js/script.js';

const Options = (props) => {
  const users = props.users;
  const key = props.keycode;
  const userid = props.userid;
  const database = props.database;
  const userInfo = users.filter((f) => { return f.key == userid });
  const memo = (userInfo.length > 0 &&
                userInfo[0].value.userinfo &&
                userInfo[0].value.userinfo.memo) ?
                userInfo[0].value.userinfo.memo : '';

  return (
    <div className="chat-options">
      <div className="chat-memo">
        <div className="chat-memo-header">메모</div>
        <div className="chat-memo-body">
          <textarea placeholder="메모를 입력해주세요." value={memo}></textarea>
        </div>
        <div
          className="chat-memo-footer"
          onClick={() => {

          }}>메모 저장하기</div>
      </div>
      <div className="chat-history">
        <div className="chat-history-header">이전 대화목록</div>
        <div className="chat-history-body"></div>
      </div>
      <div className="chat-complete">
        대화 종료하기
      </div>
    </div>
  )
}

export default Options
