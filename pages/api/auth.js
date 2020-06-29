// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import admin from '../../lib/firebase'

export default (req, res) => {
  const uuid = req.body.uuid

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  res.statusCode = 200

  if (req.method === 'POST' && uuid) {
    admin.auth().createCustomToken(uuid)
      .then(function(customToken) {
        res.json({ result: 'success', token: customToken })
      })
      .catch((error) => {
        res.json({ result: 'failure', error: error })
      })
  }
  else {
    res.json({ result: 'failure', error: uuid, message: 'invalid uuid' })
  }
}
