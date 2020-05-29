import React from 'react';
import Message from './Message';

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
  const [state, dispatch] = React.useReducer(reducer, initialState);
  let input

  React.useEffect(() => {
    dispatch({ type: 'clearMessage' });

    const chat = database.ref(databaseRef).orderByChild('timestamp');

    // 구독
    chat.on('child_added', function(snapshot) {
      dispatch({
        type: 'addMessage',
        messages: snapshot.val(),
        userid: userid
      })
    })

    // 구독해제
    return () => {
      chat.off();
    }
  }, [userid])

  return (
    <>
      <div>
        <div className="messages">
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

        const messageId = Math.random().toString(36).substr(2, 9);
        database.ref(databaseRef + '/' + messageId).set({
            id: messageId,
            userId: 'c1cd7759-9784-4fac-a667-3685d6b2e4a0',
            message: input.value,
            type: 1,
            timestamp: new Date().getTime()
        });

        input.value = ''
      }}>
        <input className="message-input" ref={node => input = node} />
        <button className="message-button-send" type="submit">
          Send
        </button>
      </form>
    </>
  )
}

export default Chat
