export default (req, res) => {

  const ip = req.headers['x-real-ip'] || req.connection.remoteAddress
  const now = new Date()
  const nowStr = `${now.getFullYear()}-${now.getMonth()
                                         + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

  console.log(`[${nowStr}] CHECK ${ip}`)

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  res.statusCode = 200
  res.json('SMLOG_CHAT_SERVER_OK')
}