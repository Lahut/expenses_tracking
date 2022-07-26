const express = require("express");
const dotenv = require("dotenv");
const { addExpenses } = require("./services");
const app = express();

app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
  res.send("Success!");
});

app.post("/line-webhook", async (req, res) => {
  if (req.body.events.lenght != 0) {
    if (req.body.events[0].message.type === "text") {
      const textInput = req.body.events[0].message.text.split(" ");
      const expense = {
        type: textInput[0],
        name: textInput[1],
        category: textInput[2],
        cost: textInput[3],
        replyToken: req.body.events[0].replyToken,
      };
      if (expense.type == "a") {
        await addExpenses(expense);
      }
      res.send().status(200);
    }
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
