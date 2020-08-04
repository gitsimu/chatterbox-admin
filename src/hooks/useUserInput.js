import React, { useEffect } from 'react'

const useUserInput = userid => {
  const input = React.useRef()
  const lastUser = React.useRef()
  const editing = React.useRef({})

  useEffect(() => {
    if (lastUser.current) {
      editing.current[lastUser.current] = input.current.value
    }
    input.current.value = editing.current[userid] || ''

    lastUser.current = userid
  }, [userid])

  return input
}

export default useUserInput