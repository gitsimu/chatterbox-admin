import React from 'react'
import { connect } from 'react-redux'
import Add from '../icon/add.svg'

const DEFAULT_DATA = {
  0: {
    text: '고객응대',
    data: {
      0: { text: '인사', message: '안녕하세요.\n무엇을 도와드릴까요?', color: '#ff6347' },
      1: { text: '지연양해', message: '죄송합니다.\n잠시만 기다려주시기 바랍니다.', color: '#ffeb3b' },
      2: { text: '지연사과', message: '답변이 지연되어 죄송합니다.', color: '#009688' },
      3: { text: '통상사과', message: '불편을 끼쳐드려 대단히 죄송합니다.', color: '#03a9f4' },
      4: { text: '종료인사', message: '문의 주셔서 감사합니다. 즐거운 하루 보내시기 바랍니다.', color: '#3f51b5' },
    }
  },
  1: {
    text: '되묻기',
    data: {
      0: { text: '연락처', message: '고객님 연락처를 남겨주시면 대응해 드리겠습니다.', color: '#ff6347' },
      1: { text: '이메일', message: '고객님 이메일 주소를 남겨주시면 대응해 드리겠습니다.', color: '#03a9f4' },
      2: { text: '주소', message: '고객님 주소를 남겨주시면 대응해 드리겠습니다.', color: '#9c27b0' },
    }
  },
  2: {
    text: '배송관련',
    data: {
      0: { text: '출고지연', message: '주문하신 상품의 출고가 지연되어 배송이 늦어질 예정입니다.\n최대한 빠르게 받으실 수 있도록 노력하겠습니다.', color: '#ff6347' },
      1: { text: '주문번호 확인', message: '주문번호를 남겨주시면 확인 후 답변 드리겠습니다.', color: '#03a9f4' },
      2: { text: '배송번호 확인', message: '배송번호를 남겨주시면 확인 후 답변 드리겠습니다.', color: '#9c27b0' },
    }
  }
}

const ShortcutMessage = ({settings, ...props}) => {
  const database = props.database
  const onChangeMessage = props.onChangeMessage
  const [shortcutData, setShortcutData] = React.useState()
  const [shortcutModifyData, setShortcutModifyData] = React.useState()
  const [shortcutMessage, showShortcutMessage] = React.useState(false)
  const [shortcutModify, showShortcutModify] = React.useState(false)

  const [selectedCategory, selectCategory] = React.useState()
  const [selectedModifyCategory, selectModifyCategory] = React.useState()

  const [searchKeyword, setSearchKeyword] = React.useState('')
  const [shortcutTooltip, setShortcutTooltip] = React.useState('')
  const [shortcutTooltipHandler, setShortcutTooltipHandler] = React.useState()
  const tooltipRef = React.useRef(null)

  React.useEffect(() => {
    database.ref(`/${settings.key}/shortcut`)
    .once('value')
    .then((snapshots) => {
      if (snapshots.val() === null) return {}

      const arr = []
      snapshots.forEach(snapshot => {
        arr.push(snapshot.val())
      })
      return arr
    })
    .then((data) => {
      if (data && data.length > 0) {
        // array to object
        for (const d of data) {
          d.data = d.data ? Object.assign({}, d.data) : {}
        }
        setShortcutData(Object.assign({}, data))
      } else {
        setShortcutData(DEFAULT_DATA)
      }
    })
  }, [])

  const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj))
  }

  const onShowShortcutModify = (show) => {
    // {...shortcutData} -> shllow copy
    if (show) {
      const data = deepCopy(shortcutData)
      delete data['search']
      setShortcutModifyData(data)
    }
    showShortcutModify(show)
  }

  const onChangeCategoryText = (value, key) => {
    setShortcutModifyData(old => {
      const obj = deepCopy(old)
      obj[key].text = value
      return {...obj}
    })
  }

  const onChangeShortcutValue = (type, value, key) => {
    setShortcutModifyData(old => {
      const obj = deepCopy(old)
      if (type === 'text') {
        obj[selectedModifyCategory].data[key].text = value
      } else if (type === 'message') {
        obj[selectedModifyCategory].data[key].message = value
      } else if (type === 'color') {
        obj[selectedModifyCategory].data[key].color = value
      }
      return {...obj}
    })
  }

  const onChangeCategorySort = (axis, i) => {
    const index = parseInt(i)
    const targetIndex = axis === 'up' ? index - 1 : index + 1
    setShortcutModifyData(old => {
      if (targetIndex < 0 || targetIndex > old.length - 1) return old
      else {
        const obj = deepCopy(old)
        const tmp = obj[index]
        obj[index] = obj[targetIndex]
        obj[targetIndex] = tmp
        return {...obj}
      }
    })
  }

  const onChangeShortcutSort = (axis, i) => {
    const index = parseInt(i)
    const targetIndex = axis === 'up' ? index - 1 : index + 1
    setShortcutModifyData(old => {
      if (targetIndex < 0 || targetIndex > old.length - 1) return old
      else {
        const obj = deepCopy(old)
        const tmp = obj[selectedModifyCategory].data[index]
        obj[selectedModifyCategory].data[index] = obj[selectedModifyCategory].data[targetIndex]
        obj[selectedModifyCategory].data[targetIndex] = tmp
        return {...obj}
      }
    })
  }

  const onDeleteCategory = (key) => {
    setShortcutModifyData(old => {
      const obj = deepCopy(old)
      const deleted = Object.keys(obj).map((o, i) => {
        if (i === parseInt(key)) return
        else {
          return obj[o]
        }
      })
      return {...deleted.filter(d => { return d !== undefined })}
    })
  }

  const onDeleteShortcut = (key) => {
    setShortcutModifyData(old => {
      const obj = deepCopy(old)
      const deleted = Object.keys(obj[selectedModifyCategory].data).map((o, i) => {
        if (i === parseInt(key)) return
        else {
          return obj[selectedModifyCategory].data[o]
        }
      })
      obj[selectedModifyCategory].data = {...deleted.filter(d => { return d !== undefined })}
      return {...obj}
    })
  }

  const onAddCategory = () => {
    setShortcutModifyData(old => {
      const obj = deepCopy(old)
      obj[Object.keys(obj).length] = {
        text: '새 카테고리',
        data: {}
      }
      return {...obj}
    })
  }

  const onAddShortcut = () => {
    if (!selectedModifyCategory) return

    setShortcutModifyData(old => {
      const obj = deepCopy(old)

      if (obj[selectedModifyCategory] && obj[selectedModifyCategory].data) {
        obj[selectedModifyCategory].data[Object.keys(obj[selectedModifyCategory].data).length] = {
          text: '새 단축 메세지',
          message: '',
          color: '#ff6347'
        }
        return {...obj}
      } else {
        return old
      }
    })
  }
  
  const onSaveShortcut = async () => {
    await database.ref(`/${settings.key}/shortcut`).set(shortcutModifyData)
    alert('단축 메세지 설정이 저장되었습니다.')
    setShortcutData(shortcutModifyData)
    showShortcutModify(false)
  }

  const onSearchKeyword = () => {
    const result = []
    const _shortcutData = deepCopy(shortcutData)
    delete _shortcutData['search']

    if (searchKeyword && searchKeyword !== '') {
      for (const shortcut of Object.values(_shortcutData)) {
        for (const data of Object.values(shortcut.data)) {
          if (data.text.includes(searchKeyword) || 
            data.message.includes(searchKeyword)) {
            result.push(data)
          }
        }
      }
      
      setShortcutData(old => {
        const obj = {
          ...old,
          'search': {
            text: `검색 결과 (${result.length})`,
            data: Object.assign({}, result),
          }
        }
        return obj
      })
      selectCategory('search')
    } else {
      setShortcutData(old => {
        const obj = old
        delete obj['search']
        return {...obj}
      })
      selectCategory('0')
    }
  }

  const onShowShortcutTooltip = (e, value) => {
    if (value && value !== '') {
      const rect = e.currentTarget.getBoundingClientRect()
      
      setShortcutTooltipHandler(setTimeout(() => {
        tooltipRef.current.style.top = `${rect.top + 35}px`
        tooltipRef.current.style.left = `${rect.left}px`
        setShortcutTooltip(value)
      }, 500))
    } else {
      clearTimeout(shortcutTooltipHandler)
      setShortcutTooltip(value)
    }
  }

  return (<>
    {shortcutMessage ? (
      <div className="shortcut-message" style={props.style}>
        {/* <div className="shortcut-message-option">
          <div onClick={() => {onShowShortcutModify(true)}}>편집</div>
          <div onClick={() => {showShortcutMessage(false)}}>닫기</div>
        </div> */}
        <div className="shortcut-message-top">
          <div className="shortcut-message-category">
            {shortcutData && Object.keys(shortcutData).map((key, i) => {
              return (
                <div key={`shortcut-message-category-${i}`}
                  className={selectedCategory === key ? "active" : ""}
                  onClick={() => {selectCategory(key)}}>
                  {shortcutData[key]?.text || ""}
                </div>
              )
            })}
          </div>
          <div className="shortcut-message-search">
            <input type="text" 
              value={searchKeyword} 
              onChange={(e) => {setSearchKeyword(e.target.value)}} 
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onSearchKeyword()
                }
              }}
              placeholder="Search.."></input>
            <div onClick={() => {onShowShortcutModify(true)}}><i className="icon-settings"></i></div>
            <div onClick={() => {showShortcutMessage(false)}}><div className="close"></div></div>
          </div>
        </div>
        <div className="shortcut-message-container">
          <div className="remove" onClick={() => { onChangeMessage('') }}>✕</div>
          {selectedCategory
          && shortcutData[selectedCategory] 
          && shortcutData[selectedCategory].data
          && Object.keys(shortcutData[selectedCategory].data).map((key, i) => {
            const shortcut = shortcutData[selectedCategory].data[key]
            if (shortcut) {
              return (
                <div key={`shortcut-message-${i}`}
                  onMouseEnter={(e) => {
                    onShowShortcutTooltip(e, shortcut.message)
                  }}
                  onMouseLeave={(e) => {
                    onShowShortcutTooltip(e, undefined)
                  }}
                  onClick={() => { onChangeMessage(shortcut.message) }}>
                  <div className="dot" style={{backgroundColor: shortcut.color}}></div>
                  {shortcut.text}
                </div>
              )
            }
          })}
          {(!selectedCategory 
          || !shortcutData[selectedCategory] 
          || Object.keys(shortcutData[selectedCategory]?.data).length === 0) && (
            <span style={{display: 'inline-flex', padding: 12, color: '#ccc', userSelect: 'none'}}>단축 메세지가 없습니다.</span>
          )}
        </div>
        
        <div className="shortcut-message-tooltip" ref={tooltipRef}>
          {shortcutTooltip}
        </div>
      </div>
    ) : (
      <div className="shortcut-message-icon"
        style={props.style}
        onClick={() => {
          showShortcutMessage(true)
          selectCategory('0')
        }}>
        <i className="icon-speech"></i>
      </div>
    )}
    {shortcutModify && (
      <div className="shortcut-modify">
        <div className="shortcut-modify-container">
          <div>
            <div className="shortcut-modify-title">
              <div style={{flex: 1}}>카테고리 ({Object.keys(shortcutModifyData).length})</div>
              <Add onClick={() => {onAddCategory()}}/>
            </div>
            <div className="shortcut-modify-list">
              {shortcutModifyData && Object.keys(shortcutModifyData).map((key, i) => {
                return (
                  <div key={`shortcut-modify-category-${i}`}
                    className={selectedModifyCategory === key ? "shortcut-modify-category active" : "shortcut-modify-category"} 
                    onClick={() => {selectModifyCategory(key)}}>
                    <input type="text"
                      value={shortcutModifyData[key].text}
                      onChange={(e) => {
                        onChangeCategoryText(e.target.value, key)
                      }}/>
                    <div className="shortcut-modify-category-option">
                      <div className="up" onClick={() => {onChangeCategorySort('up', key)}}><i className="icon-arrow-up"></i></div>
                      <div className="down" onClick={() => {onChangeCategorySort('down', key)}}><i className="icon-arrow-down"></i></div>
                      <div className="delete" onClick={() => {
                        if (confirm('이 카테고리를 삭제하시겠습니까?')) {
                          onDeleteCategory(key)
                        }
                      }}><i className="icon-trash"></i></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <div className="shortcut-modify-title">
              <div style={{flex: 1}}>
                단축 메세지 (
                {function() {
                  try {
                    return Object.keys(shortcutModifyData[selectedModifyCategory].data).length
                  }
                  catch(ex) {
                    return 0
                  }
                }()})
              </div>
              <Add onClick={() => {onAddShortcut()}}/>
            </div>
            <div className="shortcut-modify-list">
              {shortcutModifyData
              && selectedModifyCategory
              && shortcutModifyData[selectedModifyCategory]
              && shortcutModifyData[selectedModifyCategory].data
              && Object.keys(shortcutModifyData[selectedModifyCategory].data).map((key, i) => {
                const shortcut = shortcutModifyData[selectedModifyCategory].data[key]
                return (
                  <div key={`shortcut-modify-message-${i}`}
                    className="shortcut-modify-message">
                    <input value={shortcut.text} onChange={(e) => {onChangeShortcutValue('text', e.target.value, key)}}></input>
                    <textarea value={shortcut.message} onChange={(e) => {onChangeShortcutValue('message', e.target.value, key)}}></textarea>
                    <div className="shortcut-modify-message-option">
                      <div className="shortcut-modify-message-option-color">
                        <div className={shortcut.color === "#e53935" ? "active" : ""} onClick={() => {onChangeShortcutValue('color', '#e53935', key)}} style={{backgroundColor: "#e53935"}}></div>
                        <div className={shortcut.color === "#ff6347" ? "active" : ""} onClick={() => {onChangeShortcutValue('color', '#ff6347', key)}} style={{backgroundColor: "#ff6347"}}></div>
                        <div className={shortcut.color === "#ffeb3b" ? "active" : ""} onClick={() => {onChangeShortcutValue('color', '#ffeb3b', key)}} style={{backgroundColor: "#ffeb3b"}}></div>
                        <div className={shortcut.color === "#009688" ? "active" : ""} onClick={() => {onChangeShortcutValue('color', '#009688', key)}} style={{backgroundColor: "#009688"}}></div>
                        <div className={shortcut.color === "#03a9f4" ? "active" : ""} onClick={() => {onChangeShortcutValue('color', '#03a9f4', key)}} style={{backgroundColor: "#03a9f4"}}></div>
                        <div className={shortcut.color === "#3f51b5" ? "active" : ""} onClick={() => {onChangeShortcutValue('color', '#3f51b5', key)}} style={{backgroundColor: "#3f51b5"}}></div>
                        <div className={shortcut.color === "#9c27b0" ? "active" : ""} onClick={() => {onChangeShortcutValue('color', '#9c27b0', key)}} style={{backgroundColor: "#9c27b0"}}></div>
                        <div className={shortcut.color === "#494949" ? "active" : ""} onClick={() => {onChangeShortcutValue('color', '#494949', key)}} style={{backgroundColor: "#494949"}}></div>
                      </div>
                      <div className="shortcut-modify-message-option-button">
                        <div className="up" onClick={() => {onChangeShortcutSort('up', key)}}><i className="icon-arrow-up"></i></div>
                        <div className="down" onClick={() => {onChangeShortcutSort('down', key)}}><i className="icon-arrow-down"></i></div>
                        <div className="delete" onClick={() => {
                          if (confirm('이 메세지를 삭제하시겠습니까?')) {
                            onDeleteShortcut(key)
                          }
                        }}><i className="icon-trash"></i></div>
                      </div>
                    </div>
                    <div className="color-bar" style={{backgroundColor: shortcut.color}}></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="shortcut-modify-bottom">
          <div onClick={() => {onSaveShortcut()}}>저장</div>
          <div onClick={() => {onShowShortcutModify(false)}}>닫기</div>
        </div>
      </div>
    )}
  </>)
}

const mapStateToProps = state => ({
  messages: state.messages[state.settings.selectedUser.key],
  settings: state.settings
})

export default connect(mapStateToProps)(ShortcutMessage)