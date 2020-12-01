import React from 'react';

const useClickOustside = (action, selector, flag) => {
  React.useEffect(() => {
    if(!flag) return

    const onClickOutside = e => {
      if(e.target.closest(selector)) return
      action()
    }

    document.addEventListener('click', onClickOutside)

    return ()=>{
      document.removeEventListener('click', onClickOutside)
    }
  }, [flag])
}


export default useClickOustside