import React from 'react'

const useEventListener = () => {
  const onClickOutside = (selector, action) => {
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
  }

  const onKeyEscape = (action) => {
    const onKeyEscape = (event) => {
      if (event.code !== 'Escape') return
      action()
    }

    document.addEventListener('keydown', onKeyEscape)

    return () => {
      document.removeEventListener('keydown', onKeyEscape)
    }
  }

  return { onClickOutside, onKeyEscape }
}


export default useEventListener