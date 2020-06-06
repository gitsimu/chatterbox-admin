import React from 'react';
import FirebaseConfig from '../firebase.config';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import User from '../src/components/User'
import Chat from '../src/components/Chat'
import Info from '../src/components/Info'

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

  React.useEffect(() => {
    // firebase auth
    getFirebaseToken(key)
      .then(data => {
        firebase.auth().signInWithCustomToken(data.token)
          .then(success => {
            console.log('[Firebase Auth Valid]', success);

            const chat = database.ref(databaseRef).orderByChild('timestamp');
            chat.on('value', function(snapshot) {
              dispatch({ type: 'clearUser' })

              let items = [];
              snapshot.forEach(function (childSnapshot) {
                items.push(childSnapshot);
              });

              items.reverse().forEach(function (childSnapshot) { // order by desc
                dispatch({
                  type: 'addUser',
                  users: {
                    key: childSnapshot.key,
                    value: childSnapshot.val(),
                  }
                })
              });
            });
          })
          .catch(error => {
            console.log('[Firebase Auth Invalid]', error);
          });
      })
      .catch(error => {
        console.log('[Firebase Auth] error', error);
      })
  }, [])

  return (
    <div className="chat-admin">
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
      <div
        className="chat-info">
        <Info
          keycode={key}
          userid={selectedUser}
          database={database}/>
      </div>
    </div>
  )
}

async function getFirebaseToken(uuid) {
  const postResponse = await fetch('//localhost:3000/api/auth?uuid=' + uuid, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });

  const postData = await postResponse.json();
  return postData;
}
