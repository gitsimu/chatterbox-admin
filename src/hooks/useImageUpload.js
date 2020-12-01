import React from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

const useImageUpload = () => {
  const { key } = useSelector(state => state.settings)

  const uploadImage = React.useCallback(target => {

    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOW_FILE_EXTENSIONS = [
      'jpg', 'jpeg', 'gif', 'bmp', 'png', 'tif', 'tiff', 'tga', 'psd', 'ai', // 이미지
      'mp4', 'm4v', 'avi', 'asf', 'wmv', 'mkv', 'ts', 'mpg', 'mpeg', 'mov', 'flv', 'ogv', // 동영상
      'mp3', 'wav', 'flac', 'tta', 'tak', 'aac', 'wma', 'ogg', 'm4a', // 음성
      'doc', 'docx', 'hwp', 'txt', 'rtf', 'xml', 'pdf', 'wks', 'wps', 'xps', 'md', 'odf', 'odt', 'ods', 'odp', 'csv', 'tsv', 'xls', 'xlsx', 'ppt', 'pptx', 'pages', 'key', 'numbers', 'show', 'ce', // 문서
      'zip', 'gz', 'bz2', 'rar', '7z', 'lzh', 'alz']

    const fileSize = target.size
    const fileExtension = target.name.split('.').pop().toLowerCase()

    if (MAX_FILE_SIZE < fileSize) {
      throw new Error('한 번에 업로드 할 수 있는 최대 파일 크기는 5MB 입니다.')
    }
    if (ALLOW_FILE_EXTENSIONS.indexOf(fileExtension) === -1) {
      throw new Error('지원하지 않는 파일 형식입니다.')
    }

    const config = { headers: { 'content-type': 'multipart/form-data' } }
    const formData = new FormData()

    formData.append('file', target)
    formData.append('key', key)

    return axios.post('/api/upload', formData, config)
      .then(res=> {
        if (res.data.result !== 'success') {
          throw new Error('이미지 업로드에 실패하였습니다.')
        }

        return res
      })

  }, [key])



  return [uploadImage]
}


export default useImageUpload