import React from 'react'

const useEventListener = () => {
  const closest = function(_selector) {
    let start = this;
    while (parent) {
      const cond1 = start.parentElement ? start.parentElement.querySelector(_selector) : null;
      const cond2  = start.matches ? start.matches(_selector) : start.msMatchesSelector(_selector);
      if (cond1 && cond2) return start;
      else if (!start.parentElement) return null;
      start = start.parentElement;
    }
    return null;
  };

  const onClickOutside = (selector, action) => {
    let clickInside = false

    const onMouseDown = e => {
      clickInside = !!closest.call(e.target, selector)
    }

    const onMouseUp = e => {
      if(clickInside) return
      clickInside = !!closest.call(e.target, selector)
    }

    const onClick = e=> {
      if(clickInside) return
      clickInside = !!closest.call(e.target, selector)

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