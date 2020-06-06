// https://leerob.io/blog/nextjs-firebase-serverless
import admin from 'firebase-admin';

try {
  var serviceAccount = require("../chatterbox-3e40b-firebase-adminsdk-7mvji-7f9ebb9f28.json");
  var app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatterbox-3e40b.firebaseio.com"
  });
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    // eslint-disable-next-line no-console
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default admin;
