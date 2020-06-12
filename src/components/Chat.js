import React from 'react';
import Message from './Message';
import axios from 'axios';

const initialState = {messages: []};

function reducer(state, action) {
    switch (action.type) {
      case 'addMessage':
        return {
          messages: [...state.messages, action.messages],
          userid: action.userid,
        }
      case 'clearMessage':
        return {messages: []}
      default:
        throw new Error();
    }
}

const Chat = (props) => {
  const key = props.keycode;
  const userid = props.userid;
  const database = props.database;
  const databaseRef = props.databaseRef + '/' + userid;
  const setTabState = props.setTabState;
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const body = React.useRef(null)
  let input

  React.useEffect(() => {
    dispatch({ type: 'clearMessage' });
    const chat = database.ref(databaseRef).orderByChild('timestamp');

    // 구독
    chat.on('child_added', function(snapshot) {
      if (snapshot.key === 'userinfo'
       || snapshot.key === 'timestamp') return; // ignore userinfo, timestamp

      dispatch({
        type: 'addMessage',
        messages: snapshot.val(),
        userid: userid
      })

      setTimeout(() => {
        if (body && body.current) {
          body.current.scrollTop = body.current.scrollHeight;
        }
      }, 100)
    })

    // 구독해제
    return () => {
      chat.off();
    }
  }, [userid])

  const sendMessage = (key, id, message, type, database) => {
    const messageId = Math.random().toString(36).substr(2, 9)
    database.ref('/' + key + '/users/' + id).update({ state:1 })
    database.ref('/' + key + '/messages/' + id + '/' + messageId).update({
      id: messageId,
      userId: key,
      message: message,
      type: type,
      timestamp: new Date().getTime()
    })
    setTabState(1)
  }

  const handleFileInput = async (e) => {
    const config = { headers: { 'content-type': 'multipart/form-data' } }
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('key', key);

    // dispatch({ type: 'LOADING', isLoading: true });

    return axios.post('/api/upload', formData, config)
      .then(res => {
        console.log('upload-success', res);
        // dispatch({ type: 'LOADING', isLoading: false });

        if (res.data.result === 'success') {
          sendMessage(key, userid, JSON.stringify(res.data.file), 2, database);
        }
      })
      .catch(err => {
        console.log('upload-failure', err);
        // dispatch({ type: 'LOADING', isLoading: false });
      })
  }

  return (
    <>
      { console.log('state', state) }
      <div>
        <div className="messages" ref={body}>
          { (state.userid === userid) &&  // 중복호출 예외처리
            (state.messages.map((m, i) => (
            <Message
              opponent={userid}
              key={m.id}
              prev={state.messages[i - 1]}
              {...m}
              />
          ))) }
        </div>
      </div>

      <form onSubmit={e => {
        e.preventDefault()

        if (!input.value.trim()) return

        sendMessage(key, userid, input.value, 1, database);
        // const messageId = Math.random().toString(36).substr(2, 9);
        // database.ref(databaseRef + '/userinfo').update({ state:1 })
        // database.ref(databaseRef + '/' + messageId).update({
        //     id: messageId,
        //     userId: 'c1cd7759-9784-4fac-a667-3685d6b2e4a0',
        //     message: input.value,
        //     type: 1,
        //     timestamp: new Date().getTime()
        // });

        input.value = ''
      }}>
        <div className="addOns">
          <label>
            <i className="icon-paper-clip"></i>
            <input type="file" onChange={e => handleFileInput(e)}/>
          </label>
          <label>
            <i className="icon-emotsmile"
              onClick={e => handleEmojiContainer(e)}></i>
          </label>
        </div>
        <input className="message-input" ref={node => input = node} />
        <button className="message-button-send" type="submit">
          Send
        </button>
      </form>
    </>
  )
}

export default Chat
