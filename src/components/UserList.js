import React from 'react';
import User from './User'
import * as script from '../js/script.js';

const UserList = (props) => {
  const users = props.users;
  const [tabState, setTabState] = React.useState(0);

  console.log('userlist',users);

  const [countWait, setCountWait] = React.useState(0);
  const [countProgress, setCountProgress] = React.useState(0);
  const [countComplete, setCountComplete] = React.useState(0);

  let constComplete = 0;
  React.useEffect(() => {
    setCountWait(users.filter((f) => {
      const userState = f.value.userinfo.state ? f.value.userinfo.state : 0;
      return userState === 0
    }).length)

    setCountProgress(users.filter((f) => {
      const userState = f.value.userinfo.state;
      return userState === 1
    }).length)

    setCountComplete(users.filter((f) => {
      const userState = f.value.userinfo.state;
      return userState === 2
    }).length)
  }, [users])

  return (
    <div className="chat-list">
      <div className="chat-list-tab">
        <div
          className={tabState === 0 ? 'active' : ''}
          onClick={() => { setTabState(0) }}>
          대기
          <span>({countWait})</span>
        </div>
        <div
          className={tabState === 1 ? 'active' : ''}
          onClick={() => { setTabState(1) }}>
          진행 중
          <span>({countProgress})</span>
        </div>
        <div
          className={tabState === 2 ? 'active' : ''}
          onClick={() => { setTabState(2) }}>
          종료
          <span>({constComplete})</span>
        </div>
      </div>
      <div
        style={ {flex:1} }
        key="chat-list">
        { users.filter((f) => {
          const userState = f.value.userinfo.state ? f.value.userinfo.state : 0;
          return userState === tabState
        }).map((m, i) => (
          <User
            key={m.key}
            data={m}
            active={m.key === props.selectUser}
            clickEvent={props.setSelectedUser}/>
        ))}
      </div>
    </div>
  )
}

export default UserList
