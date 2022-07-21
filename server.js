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
const dotenv = require("dotenv");
const express = require("express");
const serviceAccount = require("./keys.json");

const app = express();
app.use(express.json());
dotenv.config();

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

app.get("/", (req, res) => {
  res.send("Success!");
});

app.post("/line-webhook", (req, res) => {
  console.log(req.body.events);
  res.send().status(200);
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
