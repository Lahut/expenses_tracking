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
const axios = require("axios").default;
const serviceAccount = require("./keys.json");

const app = express();
app.use(express.json());
dotenv.config();

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

async function sendToUser(replyToken, replyText) {
  axios.post(
    "https://api.line.me/v2/bot/message/reply",
    {
      replyToken: replyToken,
      messages: [
        {
          type: "text",
          text: replyText,
        },
      ],
    },
    {
      headers: {
        authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

async function createCollection(expenses) {
  let today = new Date();
  const data = {
    created:
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate(),
    cost: expenses.cost,
    category: expenses.category,
    name: expenses.name,
  };
  const res = await db.collection("expenses").add(data);
  await sendToUser(
    expenses.replyToken,
    `Expense have been add successfully✅ID : ${res.id} `
  );
}

async function readCollection() {
  const snapshot = await db.collection("expenses").get();

  snapshot.forEach((doc) => {
    console.log(doc.data());
  });
}

module.exports = {
  addExpenses: createCollection,
};
