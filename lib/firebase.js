// https://leerob.io/blog/nextjs-firebase-serverless
import admin from 'firebase-admin'

try {
  var serviceAccount = require("../smartlog-a3eed-firebase-adminsdk-mekw7-a877ecf549.json")
  var app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smartlog-a3eed.firebaseio.com"
  })
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    // eslint-disable-next-line no-console
    console.error('Firebase admin initialization error', error.stack)
  }
}

export default admin
