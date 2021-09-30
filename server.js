const express = require("express");
const app = express();
const port = 3000;
app.use(express.static(__dirname));

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

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
