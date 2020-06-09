export const setCookie = (cName, cValue, cDay) => {
  let expire = new Date();
  expire.setDate(expire.getDate() + cDay);
  let cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
  if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
  document.cookie = cookies;
}

export const getCookie = (cName) => {
  cName = cName + '=';
  let cookieData = document.cookie;
  let start = cookieData.indexOf(cName);
  let cValue = '';
  if(start != -1){
    start += cName.length;
    let end = cookieData.indexOf(';', start);
    if(end == -1)end = cookieData.length;
    cValue = cookieData.substring(start, end);
  }
  return unescape(cValue);
}

export const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
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
      week = new Array('일', '월', '화', '수', '목', '금', '토');

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
    toDate = toDate ? toDate : new Date(),
    diff = fromDate - toDate,
    past = diff < 0 ? true : false,
    diff = diff < 0 ? diff * -1 : diff,
    date = new Date(new Date(1970,0,1,0).getTime()+diff),
    returnString = '',
    count = 0,
    years = (date.getFullYear() - 1970);
    if(years > 0){
        var langSingle = "date.year" + (prefix ? "" : ""),
            langMultiple = "date.years" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (years > 1 ? langFn(langMultiple,[years]) : langFn(langSingle,[years]));
        count ++;
    }
    var months = date.getMonth();
    if(count < levels && months > 0){
        var langSingle = "date.month" + (prefix ? "" : ""),
            langMultiple = "date.months" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (months > 1 ? langFn(langMultiple,[months]) : langFn(langSingle,[months]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    var days = date.getDate() - 1;
    if(count < levels && days > 0){
        var langSingle = "date.day" + (prefix ? "" : ""),
            langMultiple = "date.days" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (days > 1 ? langFn(langMultiple,[days]) : langFn(langSingle,[days]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    var hours = date.getHours();
    if(count < levels && hours > 0){
        var langSingle = "date.hour" + (prefix ? "" : ""),
            langMultiple = "date.hours" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (hours > 1 ? langFn(langMultiple,[hours]) : langFn(langSingle,[hours]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    var minutes = date.getMinutes();
    if(count < levels && minutes > 0){
        var langSingle = "date.minute" + (prefix ? "" : ""),
            langMultiple = "date.minutes" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (minutes > 1 ? langFn(langMultiple,[minutes]) : langFn(langSingle,[minutes]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    var seconds = date.getSeconds();
    if(count < levels && seconds > 0){
        var langSingle = "date.second" + (prefix ? "" : ""),
            langMultiple = "date.seconds" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (seconds > 1 ? langFn(langMultiple,[seconds]) : langFn(langSingle,[seconds]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    if(prefix){
        if(returnString == ""){
            returnString = langFn("date.now");
        } else if(past)
            returnString = langFn("date.past",[returnString]);
        else
            returnString = langFn("date.future",[returnString]);
    }
    return returnString;
}
