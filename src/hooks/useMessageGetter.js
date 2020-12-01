import React from 'react'
import { useSelector } from 'react-redux'

const useMessageGetter = (database, userId) => {

  const settings = useSelector(state => state.settings)
  const key = settings.key

  const [hasBeforeMessage, setHasBeforeMessage] = React.useState(false)

  const dic = React.useRef({})

  React.useEffect(() => {
    if(!userId) return

    dic.current[userId] = dic.current[userId] || {
      ref: null,
      hasBeforeMessage: false
    }

    setHasBeforeMessage(dic.current[userId].hasBeforeMessage)
  }, [userId])

  React.useEffect(() => {
    if(!userId) return
    dic.current[userId].hasBeforeMessage = hasBeforeMessage
  }, [hasBeforeMessage])

  const getMessageList = React.useCallback((count, timestamp) => {
    return Promise.resolve()
      .then(() => {
        return database.ref(`/${key}/messages/${userId}`)
          .orderByChild('timestamp')
          .limitToLast(count)
          .endAt(timestamp ? (timestamp - 1) : +new Date())
          .once('value')
      })
      .then(snapshots => {
        if (snapshots.val() === null) return []

        const arr = []
        snapshots.forEach(snapshot => {
          arr.push(snapshot.val())
        })
        return arr
      })
      .then(arr => {
        setHasBeforeMessage(count === arr.length)
        return arr
      })
  }, [userId])

  const onMessageAdded = (timestamp, callback) => {
    if(dic.current[userId].ref) return

    dic.current[userId].ref = database.ref(`/${key}/messages/${userId}`)
                                .orderByChild('timestamp')
                                .startAt(timestamp + 1)

    dic.current[userId].ref.on('child_added', (snapshot) => {
      const addedMessage = snapshot.val()
      callback(addedMessage)
    })
  }

  const listenerOff = (userId) => {
    if(userId){
      dic.current[userId].ref?.off()
      delete dic.current[userId]

      return
    }

    Object.values(dic.current).forEach(t => t.ref?.off())
    dic.current = {};
  }

  return [getMessageList, onMessageAdded, hasBeforeMessage, listenerOff]
}


export default useMessageGetter