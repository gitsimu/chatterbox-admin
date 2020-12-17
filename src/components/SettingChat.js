import React from 'react'
import { connect } from 'react-redux'
import Mockup from './Mockup'
import { ChromePicker as _ChromePicker } from 'react-color'
import _PrettoSlider from './PrettoSlider'
import useImageUpload from '../hooks/useImageUpload'

const PrettoSlider = React.memo(_PrettoSlider)
const ChromePicker = React.memo(_ChromePicker)

const SettingChat = ({chatConfig, updateChatConfig, isLoading}) => {

  const [newConfig, setNewConfig] = React.useState(chatConfig)

  const [title, setTitle] = React.useState(chatConfig.title)
  const [subTitle, setSubTitle] = React.useState(chatConfig.subTitle)
  const [nickname, setNickname] = React.useState(chatConfig.nickname)
  const [firstMessage, setFirstMessage] = React.useState(chatConfig.firstMessage)
  const [themeColor, setThemeColor] = React.useState(chatConfig.themeColor)

  const [position, setPosition] = React.useState(chatConfig.position)

  const [pc, setPc] = React.useState(chatConfig.pc)
  const [mobile, setMobile] = React.useState(chatConfig.mobile)

  const [hide, setHide] = React.useState(chatConfig.pc.hide)
  const [axisX, setAxisX] = React.useState(chatConfig.pc.axisX)
  const [axisY, setAxisY] = React.useState(chatConfig.pc.axisY)
  const [size, setSize] = React.useState(chatConfig.pc.size)

  const [iconText, setIconText] = React.useState(chatConfig.iconText)
  const [iconTextAlign, setIconTextAlign] = React.useState(chatConfig.iconTextAlign)

  const [profileImage, setProfileImage] = React.useState(chatConfig.profileImage)

  const [selectDevice, setSelectDevice] = React.useState(0)
  const [themeColorPicker, showThemeColorPicker] = React.useState(false)

  const [uploadImage, removeImage] = useImageUpload()

  const updateConfig = React.useCallback((newVal) => {
    setNewConfig(oldVal => ({ ...oldVal, ...newVal }))
  }, []);

  const updateDevice = React.useCallback((newVal) => {
    if (selectDevice === 0) {
      setPc(pc => ({ ...pc, ...newVal }))
    }
    else {
      setMobile(mobile => ({ ...mobile, ...newVal }))
    }
  }, [selectDevice]);

  const toggleThemeColorPicker = () => {
    if(themeColorPicker) updateConfig({themeColor})

    showThemeColorPicker(!themeColorPicker)
  }

  const handleFileInput = async e => {
    const target = e.target.files[0]

    try {
      isLoading(true)
      const res = await uploadImage(target, { 'tag': 'profile' })
      return JSON.stringify(res.data.file)

    } catch ({ message }) {
      message && alert(message)
    } finally {
      isLoading(false)
    }
  }

  const handleFileRemove = () => {
    if (profileImage === null) return

    const filename = JSON.parse(profileImage).name
    removeImage(filename).catch()
  }

  React.useEffect(() => {
    if(newConfig === chatConfig) return

    updateChatConfig(newConfig)
  }, [newConfig])

  React.useEffect(() => {
    if(pc === chatConfig.pc && mobile === chatConfig.mobile) return

    setNewConfig(old => ({...old, pc:pc, mobile:mobile}))
  }, [pc, mobile])

  React.useEffect(() => {
    const device = selectDevice === 0 ? pc : mobile
    setHide(device.hide)
    setAxisX(device.axisX)
    setAxisY(device.axisY)
    setSize(device.size)
  }, [selectDevice])


  const onClickPosition = React.useCallback((val) => {
    setPosition(val)
    updateConfig({ position: val })
  }, [updateConfig]);
  const onClickPosition_lt = React.useCallback(() => onClickPosition('lt'), [onClickPosition]);
  const onClickPosition_rt = React.useCallback(() => onClickPosition('rt'), [onClickPosition]);
  const onClickPosition_lb = React.useCallback(() => onClickPosition('lb'), [onClickPosition]);
  const onClickPosition_rb = React.useCallback(() => onClickPosition('rb'), [onClickPosition]);
  const onChangeColor = React.useCallback((color) => {
    const _color = color.rgb.a === 1 ? color.hex : `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
    setThemeColor(_color)
  }, [])
  const onChangeAxisX = React.useCallback((event, value) => setAxisX(value), [])
  const onChangeAxisY = React.useCallback((event, value) => setAxisY(value), [])
  const onChangeSize = React.useCallback((event, value) => setSize(value), [])
  const onCommittedAxisX = React.useCallback((event, value) => updateDevice({ axisX : value }), [updateDevice])
  const onCommittedAxisY = React.useCallback((event, value) => updateDevice({ axisY : value }), [updateDevice])
  const onCommittedSize = React.useCallback((event, value) => updateDevice({ size : value }), [updateDevice])

  return (
    <>
      <div className="setting-menu-body">
        <div className="setting-mockup">
          <Mockup
            title={title}
            subTitle={subTitle}
            nickname={nickname}
            firstMessage={firstMessage}
            themeColor={themeColor}
            profileImage={profileImage}
            iconPosition={position}
            iconAxisX={axisX}
            iconAxisY={axisY}
            iconSize={size}
            device={selectDevice}
            text={iconText}
            textAlign={iconTextAlign}/>
        </div>
        <div style={{ flex: 1, marginLeft: 20, maxWidth: 400 }}>
          <div className="setting-input-item">
            <span>제목</span>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={() => updateConfig({title})}
            />
          </div>
          <div className="setting-input-item">
            <span>설명</span>
            <input
              value={subTitle}
              onChange={e => setSubTitle(e.target.value)}
              onBlur={() => updateConfig({subTitle})}
            />
          </div>
          <div className="setting-input-item">
            <span>프로필 이름</span>
            <input
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              onBlur={() => updateConfig({nickname})}
            />
          </div>
          <div className="setting-input-item">
            <span>첫 응대 메세지</span>
            <textarea
              value={firstMessage}
              onChange={e => setFirstMessage(e.target.value)}
              onBlur={() => updateConfig({firstMessage})}
            />
          </div>
          <div className="setting-input-item">
            <span>테마색상</span>
            <input type="text"
                   value={themeColor}
                   onChange={() => {}}
                   onClick={toggleThemeColorPicker}/>
            <div
              className="setting-color-sample"
              style={{ backgroundColor: themeColor }}>
            </div>
            <div className={themeColorPicker ? "setting-color-picker active" : "setting-color-picker"}>
              <ChromePicker
                disableAlpha={true}
                color={themeColor}
                onChange={onChangeColor}/>
              <div className="empty-background"
                   onClick={toggleThemeColorPicker}>
              </div>
            </div>
          </div>
          <div className="setting-input-item">
            <span>프로필 이미지</span>
            <div style={{ display: "flex" }}>
              <label className="setting-profile-image-upload">
                <div>새 이미지 업로드</div>
                <input
                  type="file"
                  onClick={e => (e.target.value = '')}
                  onChange={async e => {
                    handleFileRemove()
                    const path = await handleFileInput(e)
                    setProfileImage(path)
                    updateConfig({'profileImage': path})
                  }}
                />
              </label>
              { profileImage !== null && (
                <div className="setting-profile-image-remove"
                     onClick={() => {
                       handleFileRemove()
                       setProfileImage(null)
                       updateConfig({'profileImage': null})
                     }}>이미지 삭제</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="setting-menu-column">
        <div className="setting-menu-tab">
          <div className={selectDevice === 0 ? 'active' : ''}
               onClick={() => {setSelectDevice(0)}}>PC</div>
          <div className={selectDevice === 1 ? 'active' : ''}
               onClick={() => {setSelectDevice(1)}}>Mobile</div>
        </div>
        <div className="setting-menu-device">
          <div>
            <div className="setting-menu-device-item">
              <label>
                <input type="checkbox"
                       checked={hide}
                       onChange={(e) => {
                         setHide(e.target.checked)
                         updateDevice({hide: e.target.checked})
                       }}/>
                <span>채팅 아이콘 숨기기</span>
              </label>
            </div>
            <div className="setting-menu-device-item">
              <div className="setting-menu-device-item-title">아이콘 위치</div>
              <div className="row">
                <div className="screen-axis">
                  <div className={position === 'lt' ? "screen-axis-lt active" : "screen-axis-lt"}
                       onClick={onClickPosition_lt}></div>
                  <div className={position === 'rt' ? "screen-axis-rt active" : "screen-axis-rt"}
                       onClick={onClickPosition_rt}></div>
                  <div className={position === 'lb' ? "screen-axis-lb active" : "screen-axis-lb"}
                       onClick={onClickPosition_lb}></div>
                  <div className={position === 'rb' ? "screen-axis-rb active" : "screen-axis-rb"}
                       onClick={onClickPosition_rb}></div>
                </div>
                <div style={{width: 300, marginLeft: 50}}>
                  <div className="row">
                    <div className="setting-menu-device-item-title">가로 여백</div>
                    <PrettoSlider
                      step={1}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      value={axisX}
                      onChange={onChangeAxisX}
                      onChangeCommitted={onCommittedAxisX}
                    />
                  </div>
                  <div className="row">
                    <div className="setting-menu-device-item-title">세로 여백</div>
                    <PrettoSlider
                      step={1}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      value={axisY}
                      onChange={onChangeAxisY}
                      onChangeCommitted={onCommittedAxisY}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="setting-menu-device-item">
              <div className="setting-menu-device-item-title">아이콘 크기</div>
              <div style={{width: 250}}>
                <PrettoSlider
                  defaultValue={60}
                  step={1}
                  min={50}
                  max={80}
                  valueLabelDisplay="auto"
                  value={size}
                  onChange={onChangeSize}
                  onChangeCommitted={onCommittedSize}
                />
              </div>
            </div>
            {selectDevice === 0 && (
              <div className="setting-menu-device-item">
                <div className="setting-menu-device-item-title">아이콘 텍스트</div>
                <div className="setting-input-item" style={{margin: 0}}>
                  <input value={iconText}
                         placeholder="채팅 상담"
                         onChange={(e) => { setIconText(e.target.value) }}
                         onBlur={() => updateConfig({iconText})}/>
                </div>
                {iconText && iconText !== '' && (
                  <div className="setting-menu-device-item-input-radio">
                    <label>
                      <input type="radio"
                             name="icon-text-align"
                             checked={iconTextAlign !== 'right'}
                             onChange={(e) => {
                               const checked = e.target.checked
                               if(!checked) return
                               setIconTextAlign('left')
                               updateConfig({iconTextAlign: 'left'})
                             }}/>
                      <span>왼쪽</span>
                    </label>
                    <label>
                      <input type="radio"
                             name="icon-text-align"
                             checked={iconTextAlign === 'right'}
                             onChange={(e) => {
                               const checked = e.target.checked
                               if (!checked) return
                               setIconTextAlign('right')
                               updateConfig({iconTextAlign: 'right'})
                             }}/>
                      <span>오른쪽</span>
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = state => ({
  //info: state.info
})

const mapDispatchToProps = dispatch => ({
  //initMessage: m => dispatch(initMessage(m))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingChat);