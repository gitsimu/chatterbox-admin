import React from 'react'

const useClickOustside = (action, selector, flag) => {
  React.useEffect(() => {
    if(!flag) return

    let clickInside = false

    const onMouseDown = e => {
      clickInside = e.target.closest(selector)
    }

    const onMouseUp = e => {
      if(clickInside) return
      clickInside = e.target.closest(selector)
    }

    const onClick = e=> {
      if(clickInside) return
      clickInside = e.target.closest(selector)

      if (!clickInside) action()
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('click', onClick)

    return ()=>{
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('click', onClick)
    }
  }, [flag])
}


export default useClickOustside