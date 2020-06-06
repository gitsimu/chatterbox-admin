import React from 'react';

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

      setTimeout( () => {
        title.value = data.title;
        subTitle.value = data.subTitle;
        mobile.value = data.mobile;
        email.value = data.email;
        nickname.value = data.nickname;
        firstMessage.value = data.firstMessage;
      }, 500)
    })
  }, [])

  return (
    <div>
      <div className="chat-info-item">
        <span>title</span>
        <input ref={node => title = node}/>
      </div>
      <div className="chat-info-item">
        <span>subTitle</span>
        <input ref={node => subTitle = node}/>
      </div>
      <div className="chat-info-item">
        <span>mobile</span>
        <input ref={node => mobile = node}/>
      </div>
      <div className="chat-info-item">
        <span>email</span>
        <input ref={node => email = node}/>
      </div>
      <div className="chat-info-item">
        <span>nickname</span>
        <input ref={node => nickname = node}/>
      </div>
      <div className="chat-info-item">
        <span>firstMessage</span>
        <input ref={node => firstMessage = node}/>
      </div>

      <div
        style={{ backgroundColor: '#00aaff', textAlign: 'center', padding: 5, fontSize: 12, color: '#fff' }}
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
  )
}

export default Info
