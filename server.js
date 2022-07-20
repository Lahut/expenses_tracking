const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const serviceAccount = require("./keys.json");

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

async function createCollection() {
  const docRef = db.collection("expenses").doc("2");
  let today = new Date();
  const data = {
    created:
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate(),
    price: 100,
    category: "f",
    name: "ข้าวหมูกรอบพิเศษ",
  };
  const res = await docRef.set(data);
  console.log(res);
}

async function readCollection() {
  const snapshot = await db.collection("expenses").get();

  snapshot.forEach((doc) => {
    console.log(doc.data());
  });
}

// createCollection();
readCollection();
