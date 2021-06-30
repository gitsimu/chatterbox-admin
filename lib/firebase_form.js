// https://leerob.io/blog/nextjs-firebase-serverless
import admin from 'firebase-admin'

try {
  var serviceAccount = require("../smartlog-form-firebase-adminsdk-vqhlr-13f8cea11b.json")
  var app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smartlog-form-default-rtdb.firebaseio.com"
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
