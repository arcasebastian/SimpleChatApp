const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.json());

const messages = [];

app.get("/messages", (req, res) => {
  res.send(messages);
});
app.post("/messages", (req, res) => {
  messages.push(req.body);
  io.emit("message", req.body);
  res.sendStatus(200);
});

io.on("connection", (socket) => {
  console.log(`Connected client on: ${socket.conn.remoteAddress}`);
});

http.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
