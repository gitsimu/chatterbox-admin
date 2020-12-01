import React from 'react'

const useScrollTo = (element, deps) => {
  const prevHeight = React.useRef(0)
  React.useEffect(()=> {
    console.log('scroll TO', element && element.scrollHeight, prevHeight.current)
    scrollTo()

    return ()=> {
      console.log('scrollTo exit')
    }
  }, deps)

  const scrollTo = ()=> element && (element.scrollTop = element.scrollHeight - prevHeight.current)
  const setScrollBottom = ()=> (prevHeight.current = 0)
  const setScrollFix = () => element && (prevHeight.current = element.scrollHeight)

  return [scrollTo, setScrollBottom, setScrollFix]
}


export default useScrollTo