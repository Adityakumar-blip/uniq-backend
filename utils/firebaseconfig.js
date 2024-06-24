const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "dlabss.appspot.com",
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
