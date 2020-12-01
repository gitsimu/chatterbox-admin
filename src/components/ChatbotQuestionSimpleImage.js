import React from 'react';
import ChatMessageSimpleImage from './ChatMessageSimpleImage'
import useClickOustside from '../hooks/useClickOustside'
import useImageUpload from '../hooks/useImageUpload'

const ChatbotQuestionSimpleImage = ({isLoading, ...props}) => {
  const [edit, setEdit] = React.useState(true)

  const [uploadImage] = useImageUpload()

  const { location } = JSON.parse(props.message)
  const images = ['jpg', 'png', 'gif', 'jpeg', 'bmp']
  const extension = location.split('.').pop()

  useClickOustside(()=> setEdit(false), '.edit-image', edit)

  const handleFileInput = (e, file) => {
    const target = file || e.target.files[0]

    Promise.resolve()
      .then(()=> isLoading(true))
      .then(()=> uploadImage(target))
      .then(res => {
        props.onClickSave({
          message: JSON.stringify(res.data.file),
          type: 3
        })
      })
      .catch(({ message }) => message && alert(message))
      .finally(()=> isLoading(false))
  }

  return (
    <>
      {!edit && (
        <div onMouseEnter={()=> setEdit(true)}>
          <ChatMessageSimpleImage
            message={props.message}
          />
        </div>
      )}

      {edit && (
        <div
          onMouseLeave={()=> setEdit(false)}
          className="edit-image sort-target">
          {(extension && images.indexOf(extension) > -1) && (
            <div
              style={{
                backgroundColor:'white',
                cursor: 'pointer'
              }}
              className="message-thumbnail simple-thumbnail">
              <img
                src={location}
                onLoad={props.onLoadImage}
                alt="message-thumbnail"/>
              <div className="question-image-edit">
                <i
                  onClick={props.onClickDelete}
                  className='icon-trash'/>
                <label style={{
                  display: 'flex'
                }}>
                  <i className='icon-paper-clip'></i>
                  <input type='file'
                         style={{ display: 'none' }}
                         onClick={e => (e.target.value = '')}
                         onChange={e => handleFileInput(e)}/>
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ChatbotQuestionSimpleImage