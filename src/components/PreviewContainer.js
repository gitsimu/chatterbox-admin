import React from 'react'

const PreviewContainer = ({ image }) => {

  return (
    <div className={image
      ? 'preview-container active'
      : 'preview-container'}>
      <div className="preview-title">클립보드 이미지 전송</div>
      <img id='preview-image'
           src={image}
           alt=""/>
    </div>
  )
}

export default PreviewContainer