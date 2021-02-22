export const setCookie = (cName, cValue, cDay) => {
    let expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    let cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
    if(typeof cDay !== 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
  }
  
export const getCookie = (cName) => {
  cName = cName + '=';
  let cookieData = document.cookie;
  let start = cookieData.indexOf(cName);
  let cValue = '';
  if(start !== -1){
    start += cName.length;
    let end = cookieData.indexOf(';', start);
    if(end === -1)end = cookieData.length;
    cValue = cookieData.substring(start, end);
  }
  return unescape(cValue);
}

export const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export const timestampToDay = (timestamp, addMonth=0, addDays=0) => {
  const date = new Date(timestamp);
  let year = date.getFullYear(),
      month = date.getMonth()+1 + addMonth,
      day = date.getDate() + addDays;

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  return year + '.' + month + '.' + day;
}

export const timestampToTime = (timestamp, isSimple) => {
  const date = new Date(timestamp),
      year = date.getFullYear(),
      month = date.getMonth()+1,
      day = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      week = ['일', '월', '화', '수', '목', '금', '토'];

  const convertDate = year + "년 "+month+"월 "+ day +"일 ("+ week[date.getDay()] +") ";
  let convertHour = "";
  if (hour < 12) {
      convertHour = "오전 " + pad(hour) +":" + pad(minute);
  } else if(hour === 12){
      convertHour = "오후 " + pad(hour) +":" + pad(minute);
  } else{
      convertHour = "오후 " + pad(hour - 12) +":" + pad(minute);
  }

  return isSimple ? convertHour : convertDate + convertHour;
}

const pad = (n) => {
  return n > 9 ? "" + n: "0" + n;
}

export const getNiceTime = (fromDate, toDate, levels, prefix) => {
  const 
    diff = fromDate - (toDate ? toDate : new Date()),
    diffrent = diff < 0 ? diff * -1 : diff,
    date = new Date(new Date(1970,0,1,0).getTime()+diffrent),
    months = date.getMonth(),
    days = date.getDate() - 1;
  
  if (days > 7 || months > 0) {
    const 
      newDate = new Date(fromDate),
      m = newDate.getMonth() + 1,
      d = newDate.getDate()

    return `${m > 9 ? m : '0' + m}/${d > 9 ? d : '0' + d}`    
  } else {
    return _getNiceTime(fromDate, toDate, levels, prefix)
  }
}

const _getNiceTime = (fromDate, toDate, levels, prefix) => {
        var lang = {
        "date.past": "{0} 전",
        "date.future": "{0} 후",
        "date.now": "방금",
        "date.year": "{0}년",
        "date.years": "{0}년",
        "date.years.prefixed": "{0}년",
        "date.month": "{0}달",
        "date.months": "{0}달",
        "date.months.prefixed": "{0}달",
        "date.day": "{0}일",
        "date.days": "{0}일",
        "date.days.prefixed": "{0}일",
        "date.hour": "{0}시간",
        "date.hours": "{0}시간",
        "date.hours.prefixed": "{0}시간",
        "date.minute": "{0}분",
        "date.minutes": "{0}분",
        "date.minutes.prefixed": "{0}분",
        "date.second": "{0}초",
        "date.seconds": "{0}초",
        "date.seconds.prefixed": "{0}초",
        // "date.past": "{0} ago",
        // "date.future": "in {0}",
        // "date.now": "now",
        // "date.year": "{0} year",
        // "date.years": "{0} years",
        // "date.years.prefixed": "{0} years",
        // "date.month": "{0} month",
        // "date.months": "{0} months",
        // "date.months.prefixed": "{0} months",
        // "date.day": "{0} day",
        // "date.days": "{0} days",
        // "date.days.prefixed": "{0} days",
        // "date.hour": "{0} hour",
        // "date.hours": "{0} hours",
        // "date.hours.prefixed": "{0} hours",
        // "date.minute": "{0} minute",
        // "date.minutes": "{0} minutes",
        // "date.minutes.prefixed": "{0} minutes",
        // "date.second": "{0} second",
        // "date.seconds": "{0} seconds",
        // "date.seconds.prefixed": "{0} seconds",
    },
    langFn = function(id,params){
        var returnValue = lang[id] || "";
        if(params){
            for(var i=0;i<params.length;i++){
                returnValue = returnValue.replace("{"+i+"}",params[i]);
            }
        }
        return returnValue;
    },
    diff = fromDate - (toDate ? toDate : new Date()),
    past = diff < 0 ? true : false,
    diffrent = diff < 0 ? diff * -1 : diff,
    date = new Date(new Date(1970,0,1,0).getTime()+diffrent),
    returnString = '',
    count = 0,
    years = (date.getFullYear() - 1970);

    let langSingle, langMultiple

    if(years > 0){
        langSingle = "date.year" + (prefix ? "" : "")
        langMultiple = "date.years" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (years > 1 ? langFn(langMultiple,[years]) : langFn(langSingle,[years]));
        count ++;
    }
    var months = date.getMonth();
    if(count < levels && months > 0){
        langSingle = "date.month" + (prefix ? "" : "")
        langMultiple = "date.months" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (months > 1 ? langFn(langMultiple,[months]) : langFn(langSingle,[months]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    var days = date.getDate() - 1;
    if(count < levels && days > 0){
        langSingle = "date.day" + (prefix ? "" : "")
        langMultiple = "date.days" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (days > 1 ? langFn(langMultiple,[days]) : langFn(langSingle,[days]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    var hours = date.getHours();
    if(count < levels && hours > 0){
        langSingle = "date.hour" + (prefix ? "" : "")
        langMultiple = "date.hours" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (hours > 1 ? langFn(langMultiple,[hours]) : langFn(langSingle,[hours]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    var minutes = date.getMinutes();
    if(count < levels && minutes > 0){
        langSingle = "date.minute" + (prefix ? "" : "")
        langMultiple = "date.minutes" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (minutes > 1 ? langFn(langMultiple,[minutes]) : langFn(langSingle,[minutes]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    var seconds = date.getSeconds();
    if(count < levels && seconds > 0){
        langSingle = "date.second" + (prefix ? "" : "")
        langMultiple = "date.seconds" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (seconds > 1 ? langFn(langMultiple,[seconds]) : langFn(langSingle,[seconds]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    if(prefix){
        if(returnString === ""){
            returnString = langFn("date.now");
        } else if(past)
            returnString = langFn("date.past",[returnString]);
        else
            returnString = langFn("date.future",[returnString]);
    }
    return returnString;
}

export const guestCodeGenerator = (uid) => {
  const name1 = ['다홍', '주황', '노랑', '연두', '초록', '백록', '진초록', '청죽', '청록', '연청', '하늘', '벽청', '분홍', '자주', '연보라', '남보라'];
  const name2 = ['쿠키', '파스타', '파이', '치즈', '어니언', '요거트', '크림', '애플', '바나나', '망고', '키위', '라임', '민트', '초콜릿', '코코넛', '케이크', '머랭', '버터', '아이스티', '커피', '마카롱', '마들렌', '감자', '엉겅퀴', '갈릭', '카모마일', '에이드', '샐러드', '크루아상', '타르트', '에일', '라거', '와인', '오렌지', '딸기', '자두', '복숭아', '호박', '자몽', '살구', '해바라기', '자동차', '비행기', '자전거', '창문', '튤립', '수선화', '장미', '안개', '야자수', '선인장', '단풍', '안경', '나무', '유리', '튜브', '액자', '양초', '보드', '네온', '필름', '달팽이', '오두막', '퍼퓸'];
  const color1 = ['#fbafaf', '#ffbc98', '#ffd993', '#ebef96', '#b8d579', '#d0e4c8', '#a9d19f', '#9debe3', '#81d7e6', '#9de2fb', '#71daf4', '#9fc9f1', '#f5d1e7', '#d8acce', '#d8c2eb', '#aaa1da'];

  const uid32 = parseInt(uid, 16).toString(32);
  const code1 = parseInt(uid.slice(uid.length - 2, uid.length - 1), 32); // 16
  const code2 = parseInt(uid32.slice(uid32.length - 3, uid32.length - 2), 32); // 32
  const code3 = parseInt(uid32.slice(uid32.length - 4, uid32.length - 3), 32); // 32
  const code4 = parseInt(uid.slice(0, 2), 32);

  const obj = {};
  if (name1[code1] && name2[code2 + code3]) {
    obj.guestCode = name1[code1] + ' ' + name2[code2 + code3] + ' ' + code4;
    obj.colorCode = color1[code1];
  }
  else {
    obj.guestCode = '알수없는 사용자';
    obj.colorCode = '#00aaff';
  }
  return obj;
}

export const formatDate = date => {
  let d = new Date(parseInt(date, 10) * 1000)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  let hours = d.getHours()
  let ampm = hours >= 12 ? '오후' : '오전'
  let minutes = '' + d.getMinutes()
  let seconds = '' + d.getSeconds()
  return (
    [
      d.getFullYear(),
      month.length < 2 ? '0' + month : month,
      day.length < 2 ? '0' + day : day
    ].join('-') +
    `  ${ampm} ` +
    [
      // hours.length < 2 ? '0' + hours : hours,
      hours % 12 ? hours % 12 : 12,
      minutes.length < 2 ? '0' + minutes : minutes,
      seconds.length < 2 ? '0' + seconds : seconds
    ].join(':')
  )
}

export const initConfig = {
  title: '채팅 상담',
  subTitle: '보통 몇 분 내에 응답합니다',
  nickname: 'Manager',
  firstMessage: '방문해주셔서 감사합니다.\n궁금한 내용을 편하게 남겨주세요.'
}

export const genId = () => Math.random().toString(36).substr(2, 9)

export const getTempId = () => {
  if(!localStorage.getItem("CHAT_ADMIN_ID")) {
    localStorage.setItem("CHAT_ADMIN_ID", genId())
  }
  return localStorage.getItem("CHAT_ADMIN_ID")
}