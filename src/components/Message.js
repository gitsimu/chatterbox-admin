import React from 'react';

const Message = (props) => {

  const isOpponent  = props.opponent === props.userId;
  const isSameUser = (props.prev && (props.prev.userId === props.userId));

  return (
    <>
      { !isSameUser && (
        <div className="margin-top-15"></div>
      )}
      { !isOpponent ? (
        <div className="message myself">
          <div className="message-time">
            { timestampToTime(props.timestamp, true) }
          </div>
          <div className="message-inner">
            { props.message }
          </div>
        </div>
      ) : (
        <div className="message opponent">
          <div className="message-profile">
            { !isSameUser && (
              <div className="message-profile-icon">Q</div>
            )}
          </div>
          <div className="message-body">
            { !isSameUser && (
              <div className="message-top">
                <div className="message-name">
                  QUV
                </div>
              </div>
            )}
            <div className="message-bottom">
              <div className="message-inner">
                { props.message }
              </div>
              <div className="message-time">
                { timestampToTime(props.timestamp, true) }
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function timestampToTime(timestamp, isSimple) {
    const date = new Date(timestamp),
        year = date.getFullYear(),
        month = date.getMonth()+1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        week = new Array('일', '월', '화', '수', '목', '금', '토');

    const convertDate = year + "년 "+month+"월 "+ day +"일 ("+ week[date.getDay()] +") ";
    let convertHour = "";
    if(hour < 12){
        convertHour = "오전 " + pad(hour) +":" + pad(minute);
    }else if(hour === 12){
        convertHour = "오후 " + pad(hour) +":" + pad(minute);
    }else{
        convertHour = "오후 " + pad(hour - 12) +":" + pad(minute);
    }

    return isSimple ? convertHour : convertDate + convertHour;
}

function pad(n) {
    return n > 9 ? "" + n: "0" + n;
}

export default Message
