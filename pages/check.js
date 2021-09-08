export default function Check () {
  return (<div>SMLOG_CHAT_SERVER_OK</div>)
}

export async function getServerSideProps (context) {
  const { req } = context
  const ip = req.headers['x-real-ip'] || req.connection.remoteAddress
  const now = new Date()
  const nowStr = `${now.getFullYear()}-${now.getMonth()
                                         + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

  console.log(`[${nowStr}] CHECK ${ip}`)

  return {
    props: {} // will be passed to the page component as props
  }
}
