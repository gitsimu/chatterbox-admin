import React from 'react'

const useScrollTo = (element, deps) => {
  const prevHeight = React.useRef(0)

  React.useEffect(()=> {
    scrollTo()
  }, deps)

  const scrollTo = React.useCallback(()=> {
    if(!element) return
    element.scrollTop = element.scrollHeight - prevHeight.current
  }, [element])

  const setScrollBottom = ()=> {
    prevHeight.current = 0
  }
  const setScrollFix = () => {
    if(!element) return
    prevHeight.current = element.scrollHeight
  }

  return [scrollTo, setScrollBottom, setScrollFix]
}


export default useScrollTo