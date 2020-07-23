import React from 'react'
import FirebaseConfig from '../firebase.config'
import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import axios from 'axios'

import { connect } from 'react-redux'
import { addUsers, clearUsers, selectedUser, signIn, signOut } from '../src/actions'

import UserList from '../src/components/UserList'
import Chat from '../src/components/Chat'
import Memo from '../src/components/Memo'
import Info from '../src/components/Info'
import Setting from '../src/components/Setting'

import * as script from '../src/js/script.js'

function Main({ users, messages, settings, addUsers, clearUsers, selectedUser, signIn, signOut, ...props }) {
  const [screenState, setScreenState] = React.useState(0)
  const [tabState, setTabState] = React.useState(0)
  const [imageViewer, showImageViewer] = React.useState(null)
  const [loading, isLoading] = React.useState(false)

  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig)
  }
  const database = firebase.database()

  React.useEffect(() => {
    let chat
    // simpleline icons
    let simplelineLink = document.createElement("link")
    simplelineLink.href = "https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css"
    simplelineLink.rel = "stylesheet"
    simplelineLink.type = "text/css"
    document.querySelector('body').appendChild(simplelineLink)

    const params = getParams()
    const key = params.key

    if (!key || key === '') {
      alert('Invalid chat key\nPlease try again')
      return
    }

    isLoading(true)
    signIn({ key: key })

    // firebase
    getFirebaseAuthToken(settings.key)
      .then(res => {
        const data = res.data
        if (data.result === 'success') {
          firebase.auth().signInWithCustomToken(data.token)
            .then(success => {
              isLoading(false)

              chat = database.ref(`/${settings.key}/users`).orderByChild('timestamp')
              chat.on('value', (snapshot) => {
                clearUsers()

                let items = []
                snapshot.forEach((childSnapshot) => {
                  items.push(childSnapshot)
                })

                items.reverse().forEach((childSnapshot) => { // order by desc
                  const k = childSnapshot.key
                  const v = childSnapshot.val()
                  const code = script.guestCodeGenerator(k)
                  const user = {
                    key: k,
                    value: v,
                    guestCode: (v && v.nickname) ? v.nickname : code.guestCode,
                    colorCode: code.colorCode,
                  }

                  addUsers(user)
                })
              })
            })
            .catch(error => {
              isLoading(false)
              alert('인증에 실패하였습니다.')
            })
        }
      })
      .catch(error => {
        isLoading(false)
        alert('인증 서버에서 연결을 거부하였습니다.')
      })

    // return () => { chat.off() }
  }, [addUsers, clearUsers, database, isLoading, selectedUser, settings.key])

  return (
    <div className="App chatterbox-theme-light">
      <div className="main">
        <div className="container-menu card">
          <div
            className={screenState === 0 ? "chat-lnb-item active" : "chat-lnb-item"}
            onClick={() => { setScreenState(0) }}>
            <i className="icon-bubble"></i>
            <div className="tooltip">채팅 목록</div>
          </div>
          { false && (
          <div
            className={screenState === 1 ? "chat-lnb-item active" : "chat-lnb-item"}
            onClick={() => { setScreenState(1) }}>
            <i className="icon-user"></i>
            <div className="tooltip">유저 목록</div>
          </div>
          )}
          <div
            className={screenState === 2 ? "chat-lnb-item active" : "chat-lnb-item"}
            onClick={() => { setScreenState(2) }}>
            <i className="icon-settings"></i>
            <div className="tooltip">설정</div>
          </div>
          {/* <div className="chat-lnb-item sign-out"
            onClick={() => {
              storage.remove('userData', (err) => {
                if (err) {
                  console.log('[ERROR] Local storage remove failure', err)
                  throw err
                }
              })
              signOut()
            }}>
            <i className="icon-power"></i>
            <div className="tooltip">로그아웃</div>
          </div> */}
        </div>
        <div className={ screenState === 0 ? "container-screen-0" : "container-screen-0 hide" }>
          <div className="container-center">
            <div className="chat-list card">
              <UserList
                database={database}
                tabState={tabState}
                setTabState={setTabState}/>
            </div>
            <div className="chat-body">
              {(settings.selectedUser && settings.selectedUser.key) && (
                <Chat
                  database={database}
                  tabState={tabState}
                  setTabState={setTabState}
                  showImageViewer={showImageViewer}/>
              )}
            </div>
            <div className="chat-options">
            </div>
          </div>
          <div className="container-right">
            <Memo database={database}/>
            <Info database={database}/>
          </div>
        </div>
        <div className={ screenState === 1 ? "container-screen-1" : "container-screen-1 hide" }>
          <div></div>
        </div>
        <div className={ screenState === 2 ? "container-screen-2" : "container-screen-2 hide" }>
          <Setting
            database={database}
            isLoading={isLoading}/>
        </div>
      </div>
      { imageViewer !== null && (
        <div className="image-viewer">
          <div className="image-viewer-close"
            onClick={() => showImageViewer(null)}></div>
          <img src={imageViewer} alt="imageViewer"/>
        </div>
      )}
      { loading && (
        <div id="loading"><div></div></div>
      )}
    </div>
  )
}

const getParams = url => {
  let qs = url ? url : window.document.location.search;
  qs = qs.split('+').join(' ');

  let params = {},
      tokens,
      re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}

const getFirebaseAuthToken = async (uuid) => {
  const res = await axios.post('/api/auth', { uuid: uuid })
  return await res
}

const mapStateToProps = state => ({
  users: state.users,
  messages: state.messages,
  settings: state.settings
})

const mapDispatchToProps = dispatch => ({
  addUsers: u => dispatch(addUsers(u)),
  clearUsers: () => dispatch(clearUsers()),
  selectedUser: u => dispatch(selectedUser(u)),
  signIn: s => dispatch(signIn(s)),
  signOut: () => dispatch(signOut())
})

// export default Main
export default connect(mapStateToProps, mapDispatchToProps)(Main)
