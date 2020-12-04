import React from 'react';
import ChatMessageSimpleImage from './ChatMessageSimpleImage'
import useEventListener from '../hooks/useEventListener'
import useImageUpload from '../hooks/useImageUpload'

const ChatbotQuestionSimpleImage = ({isLoading, ...props}) => {
  const [edit, setEdit] = React.useState(true)

  const [uploadImage] = useImageUpload()

  const { location } = JSON.parse(props.message)
  const images = ['jpg', 'png', 'gif', 'jpeg', 'bmp']
  const extension = location.split('.').pop()

  const { onClickOutside } = useEventListener()

  React.useEffect(() => {
    if(!edit) return

    const offClick = onClickOutside('.edit-image', ()=> setEdit(false))

    return ()=> {
      offClick()
    }
  }, [edit])


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
        <ChatMessageSimpleImage
          onMouseEnter={()=> setEdit(true)}
          message={props.message}
        />
      )}

      {edit && (
        <div
          onMouseLeave={()=> setEdit(false)}
          className="edit-image sort-target">
          {(extension && images.indexOf(extension) > -1) && (
            <div
              style={{
                cursor: 'pointer'
              }}
              className="message-thumbnail simple-thumbnail">
              <img
                src={location}
                onLoad={props.onLoadImage}
                alt="message-thumbnail"/>
              <div className="question-image-edit">
                <label style={{
                  display: 'flex'
                }}>
                  <i className='icon-paper-clip'></i>
                  <input type='file'
                         style={{ display: 'none' }}
                         onClick={e => (e.target.value = '')}
                         onChange={e => handleFileInput(e)}/>
                </label>
                <i
                  onClick={props.onClickDelete}
                  className='icon-trash'/>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ChatbotQuestionSimpleImage