const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
app.use(express.static(__dirname));
app.use(bodyParser.json());

const messages = [
  {
    name: "Tim",
    text: "Hello",
  },
  {
    name: "Maria",
    text: "Hello",
  },
];

app.get("/messages", (req, res) => {
  res.send(messages);
});
app.post("/messages", (req, res) => {
  messages.push(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
