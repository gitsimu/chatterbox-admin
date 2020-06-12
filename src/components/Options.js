import React from 'react';
import * as script from '../js/script.js';

const Options = (props) => {
  const users = props.users;
  const key = props.keycode;
  const userid = props.userid;
  const database = props.database;
  const setTabState = props.setTabState;
  const userInfo = users.filter((f) => { return f.key == userid });

  const m = (userInfo.length > 0 &&
            userInfo[0].value &&
            userInfo[0].value.memo) ?
            userInfo[0].value.memo : '';
  const [memo, setMemo] = React.useState(m);
  React.useEffect(() => {
    setMemo(m);
  }, [props]);

  return (
    <div className="chat-options">
      <div className="chat-memo">
        <div className="chat-memo-header">메모</div>
        <div className="chat-memo-body">
          <textarea
            placeholder="메모를 입력해주세요."
            value={memo}
            onChange={(e) => { setMemo(e.target.value) }}>
          </textarea>
        </div>
        <div
          className="chat-memo-footer"
          onClick={() => {
            database.ref('/' + key + '/users/' + userid).update({ memo: memo })
            alert('메모를 저장하였습니다.');
          }}>메모 저장하기</div>
      </div>

      <div className="chat-history">
        <div className="chat-history-header">이전 대화목록</div>
        <div className="chat-history-body"></div>
      </div>

      <div
        className="chat-complete"
        onClick={() => {
          const isConfirmed = confirm('이 대화를 종료하시겠습니까?');
          if (isConfirmed) {
            database.ref('/' + key + '/users/' + userid).update({ state: 2 })
            setTabState(2);
          }
        }}>대화 종료하기</div>
    </div>
  )
}

export default Options
