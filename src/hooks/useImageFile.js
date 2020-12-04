import React from 'react'

const useImageFile = () => {
  const [imageSrc, setImagePreview] = React.useState('')
  const imageFile = React.useRef(null)

  const setImageFile = React.useCallback((inputFile) => {
    if (inputFile === null && imageFile.current === null) return
    if (inputFile === null) {
      imageFile.current = null
      setImagePreview('')
      return
    }

    imageFile.current = inputFile

    let reader = new FileReader()
    reader.onload = e => setImagePreview(e.target.result)
    reader.readAsDataURL(inputFile)
  }, [])

  return [imageSrc, imageFile.current, setImageFile]
}

export default useImageFile