import React from 'react'

function renameFile (originalFile) {
  const newName = `image_${dateString()}${originalFile.name.slice(
    originalFile.name.lastIndexOf('.'))}`

  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified
  })
}

const dateString = () => {
  const date = new Date()

  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')

  return `${hour}${minute}`
}

export default function useImageFile () {
  const [imageSrc, setImagePreview] = React.useState('')
  const imageFile = React.useRef(null)

  const setImageFile = React.useCallback((inputFile) => {
    if (inputFile === null && imageFile.current === null) return
    if (inputFile === null) {
      imageFile.current = null
      setImagePreview('')
      return
    }

    inputFile = renameFile(inputFile)
    imageFile.current = inputFile

    let reader = new FileReader()
    reader.onload = e => setImagePreview(e.target.result)
    reader.readAsDataURL(inputFile)
  }, [])

  return [imageSrc, imageFile.current, setImageFile]
}