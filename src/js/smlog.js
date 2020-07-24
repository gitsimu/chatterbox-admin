export const API = async (req, isLoading) => {
  const server = 'https://smlog.co.kr/api/app_api.php'
  const sskey = getCookie('SMTGSS')

  if (!sskey) {
    return false
  } else {
    isLoading && isLoading(true)

    let body = ''
    Object.keys(req).forEach((o, i) => {
      body += `${o}=${Object.values(req)[i]}&`
    })
    body += `sskey=${sskey}&` 

    const postResponse = await fetch(server, {
      method: 'POST',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: body
    })

    isLoading && isLoading(false)
    const postData = await postResponse.json()
    return postData
  }
}

const getCookie = (cookieName) => {
  let cookieValue
  if(document.cookie){
      const array = document.cookie.split((escape(cookieName)+'='))
      if(array.length >= 2){
          const arraySub = array[1].split(';')
          cookieValue = unescape(arraySub[0])
      }
  }
  return cookieValue
}