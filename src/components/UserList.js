import React from 'react'
import User from './User'
import { connect } from 'react-redux'
import { changeUserState, initUserState } from '../actions'

const UserList = ({ users, settings, changeUserState, initUserState, ...props }) => {
  const tabState = props.tabState
  const setTabState = props.setTabState
  const key = settings.key
  const database = props.database
  const isLoading = props.isLoading  

  const [countWait, setCountWait] = React.useState(0)
  const [countProgress, setCountProgress] = React.useState(0)
  const [countComplete, setCountComplete] = React.useState(0)

  /* 0: 일반
   * 1: 모두 선택
   */
  const [mode, setMode] = React.useState(0)

  React.useEffect(() => {
    setCountWait(users.filter((f) => {
      const userState = f.value.state || 0
      return (userState === 0)
    }).length)

    setCountProgress(users.filter((f) => {
      const userState = f.value.state
      return (userState === 1)
    }).length)

    setCountComplete(users.filter((f) => {
      const userState = f.value.state
      return (userState === 2)
    }).length)
  }, [users])

  const initMode = React.useCallback(() => {
    setMode(0)
    initUserState()
  }, [initUserState])

  const AllUserControlConfirm = type => {
    const selected = users.filter(u => {
      return u.state === 'selected'      
    })
    
    let message = `총 ${selected.length} 개의 대화방을 `
    switch(type) {
      case 'remove':
        message += `삭제하시겠습니까?`
        break
      case 'complete':
      default:
        message += `종료하시겠습니까?`
        break
    }

    const cof = confirm(message)
    if (cof) {
      AllUserControl(type, selected)
    }
  }

  const AllUserControl = React.useCallback((type, selected) => {
    Promise.resolve()
    .then(() => {
      isLoading(true)
    })
    .then(() => {
      selected.forEach(u => {
        if (type === 'complete') {
          database.ref(`/${key}/users/${u.key}`).update({ state: 2 })
        } else if (type === 'remove') {
          database.ref(`/${key}/messages/${u.key}`).remove()
          database.ref(`/${key}/users/${u.key}`).remove()
        }
      })
    })
    .finally(() => {
      initMode()
      isLoading(false)
    })
  }, [database, initMode, isLoading, key])

  return (
    <>
      <div className="chat-list-tab">
        <div
          className={tabState === 0 ? 'active' : ''}
          onClick={() => { 
            setTabState(0)
            initMode()
          }}>
          대기
          <span>({countWait})</span>
        </div>
        <div
          className={tabState === 1 ? 'active' : ''}
          onClick={() => { 
            setTabState(1)
            initMode()
          }}>
          진행 중
          <span>({countProgress})</span>
        </div>
        <div
          className={tabState === 2 ? 'active' : ''}
          onClick={() => { 
            setTabState(2)
            initMode()
          }}>
          종료
          <span>({countComplete})</span>
        </div>
      </div>
      <div
        className="chat-users"
        key="chat-list">
        { users.filter((f) => {
          const userState = f.value.state || 0
          return (userState === tabState)
        }).map((m, i) => (
          <User
            mode={mode}
            key={m.key}
            database={props.database}
            data={m}/>
        ))}
      </div>

      {/* 모두 선택 */}
      {((tabState === 0 && countWait > 0) 
      || (tabState === 1 && countProgress > 0) 
      || (tabState === 2 && countComplete > 0)) && (
        <div className="chat-list-option">
          <div className={mode === 1 ? 'all-select' : ''}
            onClick={() => {
              users.forEach(element => {
                const s = element.value.state || 0
                if (s === tabState) {
                  if (mode === 0) {
                    changeUserState({key: element.key, state: 'selected'})
                    setMode(1)
                  } else {
                    changeUserState({key: element.key, state: ''})
                    setMode(0)
                  }
                }
              })
            }}>
            모두 선택
          </div>
          {/* 대화 종료 */}
          {mode === 1 && tabState !== 2 && (
            <div className="all-complete"
              onClick={() => { AllUserControlConfirm('complete') }}>
              대화 종료
            </div>
          )}
          {/* 대화 삭제 */}
          {mode === 1 && (
            <div className="all-delete" style={{color: '#F44336'}}
              onClick={() => { AllUserControlConfirm('remove') }}>
              대화 삭제
            </div>
          )}
        </div>
      )}
    </>
  )
}

const mapStateToProps = state => ({
  users: state.users,
  settings: state.settings
})
const mapDispatchToProps = dispatch => ({
  changeUserState: u => dispatch(changeUserState(u)),
  initUserState: () => dispatch(initUserState())
})

// export default UserList
export default connect(mapStateToProps, mapDispatchToProps)(UserList)
