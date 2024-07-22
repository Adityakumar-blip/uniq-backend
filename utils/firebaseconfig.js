const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "dlabss.appspot.com",
});

const storage = admin.storage();

module.exports = { storage };
