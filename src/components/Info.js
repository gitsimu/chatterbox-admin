import React from 'react';
import Mockup from './Mockup';

let title = React.createRef();
let subTitle = React.createRef();
let mobile = React.createRef();
let email = React.createRef();
let nickname = React.createRef();
let firstMessage = React.createRef();
let expired = React.createRef();

const Info = (props) => {
  // let title = React.useRef(null)
  // let subTitle = React.useRef(null)
  // let mobile = React.useRef(null)
  // let email = React.useRef(null)
  // let nickname = React.useRef(null)
  // let firstMessage = React.useRef(null)

  const database = props.database;
  const databaseRef = '/' + props.keycode + '/' + 'config';
  const info = database.ref(databaseRef);

  React.useEffect(() => {
    info.once('value', function(snapshot) {
      const data = snapshot.val();
      console.log('[info]', data);
      if (!data) return;

      title.value = data.title;
      subTitle.value = data.subTitle;
      mobile.value = data.mobile;
      email.value = data.email;
      nickname.value = data.nickname;
      firstMessage.value = data.firstMessage;
    })
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flex: 2, backgroundColor: '#f9f9f9', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Mockup
          title={title.value}
          subTitle={subTitle.value}
          nickname={nickname.value}
          firstMessage={firstMessage.value}/>
      </div>
      <div style={{ flex: 1, marginLeft: 20 }}>
        <div className="chat-info-item">
          <span>제목</span>
          <input ref={node => title = node}/>
        </div>
        <div className="chat-info-item">
          <span>설명</span>
          <input ref={node => subTitle = node}/>
        </div>
        <div className="chat-info-item">
          <span>연락처</span>
          <input ref={node => mobile = node}/>
        </div>
        <div className="chat-info-item">
          <span>이메일</span>
          <input ref={node => email = node}/>
        </div>
        <div className="chat-info-item">
          <span>프로필 이름</span>
          <input ref={node => nickname = node}/>
        </div>
        <div className="chat-info-item">
          <span>첫 응대 메세지</span>
          <input ref={node => firstMessage = node}/>
        </div>
        <div style={{ padding: 5, marginTop: 10}}>
          <div
            style={{ backgroundColor: '#00aaff', textAlign: 'center', padding: 10, fontSize: 12, color: '#fff', borderRadius: 3 }}
            onClick={() => {
              info.set({
                title: title.value,
                subTitle: subTitle.value,
                mobile: mobile.value,
                email: email.value,
                nickname: nickname.value,
                firstMessage: firstMessage.value,
              });
              console.log(title.value, mobile.value, email.value, nickname.value, firstMessage.value)
              alert('적용되었습니다.');
            }}>
            적용하기
          </div>
        </div>
      </div>
    </div>
  )
}

export default Info
