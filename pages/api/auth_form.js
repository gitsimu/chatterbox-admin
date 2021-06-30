// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import admin from '../../lib/firebase_form'

export default (req, res) => {
  const uuid = req.body.uuid
  const svid = req.body.svid
  const additionalClaims = {
    svid: svid,
  }

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  res.statusCode = 200

  if (req.method === 'POST' && uuid) {
    admin.auth().createCustomToken(uuid, additionalClaims)
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
