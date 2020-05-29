import React from 'react';
import FirebaseConfig from '../firebase.config';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import User from '../src/components/User'
import Chat from '../src/components/Chat'

const initialState = {users: []};

function reducer(state, action) {
    switch (action.type) {
      case 'addUser':
        return {users: [...state.users, action.users]}
      case 'clearUser':
        return {users: []}
      default:
        throw new Error();
    }
}

export default function About({ props }) {
  const list = React.useRef(null)
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [selectedUser, setSelectedUser] = React.useState('');

  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig);
  }
  const key = 'c1cd7759-9784-4fac-a667-3685d6b2e4a0';
  const database = firebase.database();
  const databaseRef = '/' + key + '/messages';
  const chat = database.ref(databaseRef).orderByChild('timestamp');

  React.useEffect(() => {
    dispatch({ type: 'clearUser' })
    chat.on('child_added', function(snapshot) {
      dispatch({
        type: 'addUser',
        users: {
          key: snapshot.key,
          value: snapshot.val(),
        }
      })
    });
  }, [])

  return (
    <div style={ {display: 'flex', flexDirection: 'row'} }>
      { console.log('[state]', state)}
      <div
        style={ {flex:1} }
        ref={list}
        className="chat-list"
        key="chat-list">
        { state.users.map((m, i) => (
          <User
            key={m.key}
            data={m}
            active={m.key === selectedUser}
            clickEvent={setSelectedUser}/>
        )) }
        </div>
      <div
        style={ {flex: 2,} }
        className="chat-body"
        key="chat-body">
        { (selectedUser && selectedUser != '') && (
          <Chat
            keycode={key}
            userid={selectedUser}
            database={database}
            databaseRef={databaseRef}/>
        )}
      </div>
    </div>
  )
}
