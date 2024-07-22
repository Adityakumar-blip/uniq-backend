const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service.json");

require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  }),
});

const storage = admin.storage();

module.exports = { storage };

// const { initializeApp } = require("firebase-admin/app");
// const { getStorage } = require("firebase-admin/storage");

// const firebaseConfig = {
//   apiKey: "AIzaSyCymOf3yRPp643UTh4HNTWW1mARFdzsnUE",
//   authDomain: "dlabss.firebaseapp.com",
//   projectId: "dlabss",
//   storageBucket: "dlabss.appspot.com",
//   messagingSenderId: "625798268669",
//   appId: "1:625798268669:web:c93bc04b0c1776a66c6094",
// };

// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);

// module.exports = { app, storage };
