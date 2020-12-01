import React from 'react';

const useEscapeKey = (action, flag) => {
  React.useEffect(() => {
    if(!flag) return

    const onKeyEscape = (event) => {
      if (event.code !== 'Escape') return
      action()
    }

    document.addEventListener('keydown', onKeyEscape)

    return ()=>{
      document.removeEventListener('keydown', onKeyEscape)
    }
  }, [flag])
}


export default useEscapeKey