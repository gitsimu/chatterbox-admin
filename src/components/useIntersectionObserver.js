import { useEffect } from "react"

export default ({ root, target, onIntersect, threshold = 1.0, rootMargin = "0px" }) => {
  useEffect(() => {
    if (!root || !target) return
    const observer = new IntersectionObserver(onIntersect, {
      root,
      rootMargin,
      threshold,
    })

    observer.observe(target)
  
    return () => {
      observer.unobserve(target)
    }
  }, [target, root, rootMargin, onIntersect, threshold])
}

// https://y0c.github.io/2019/06/30/react-infinite-scroll/
// http://blog.hyeyoonjung.com/2019/01/09/intersectionobserver-tutorial/