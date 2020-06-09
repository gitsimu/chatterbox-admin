import React from 'react';
import FirebaseConfig from '../firebase.config';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import UserList from '../src/components/UserList'
import Options from '../src/components/Options'
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
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [selectedUser, setSelectedUser] = React.useState('');

  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig);
  }

  const key = 'c1cd7759-9784-4fac-a667-3685d6b2e4a0';
  const database = firebase.database();
  const databaseRef = '/' + key + '/messages';

  React.useEffect(() => {
    // simpleline icons
    let simmplelineLink = document.createElement("link");
    simmplelineLink.href = "https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css";
    simmplelineLink.rel = "stylesheet";
    simmplelineLink.type = "text/css";
    document.querySelector('body').appendChild(simmplelineLink);

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
    <>
    <div className="chat-admin">
      <UserList
        users={state.users}
        selectUser={selectedUser}
        setSelectedUser={setSelectedUser}/>

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

      <Options
        users={state.users}
        keycode={key}
        userid={selectedUser}
        database={database}
        databaseRef={databaseRef} />
    </div>
    <div
      style={{ width: 400 }}
      className="chat-info">
      <Info
        keycode={key}
        userid={selectedUser}
        database={database}/>
    </div>
    </>
  )
}

async function getFirebaseToken(uuid) {
  const postResponse = await fetch('//localhost:3000/api/auth', {
      method: 'POST',
      body: '&uuid=' + uuid,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });

  const postData = await postResponse.json();
  return postData;
}
