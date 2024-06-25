const admin = require('firebase-admin');
const serviceAccount = require('./config/firebase-adminsdk.json'); // Remplace par le chemin correct vers ton fichier JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'apiimg-7273e.appspot.com' // Remplace par le nom de ton bucket Firebase
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
