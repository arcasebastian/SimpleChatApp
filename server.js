const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const credentials = require("./credentials.json");

const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.json());

const dbUrl = `mongodb+srv://${credentials.dbUser}:${credentials.dbPass}@${credentials.cluster}?retryWrites=true&w=majority`;
const MessageModel = mongoose.model("Message", {
  name: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, required: true },
});

app.get("/messages", (req, res) => {
  MessageModel.find({}, (err, messages) => {
    if (err) res.sendStatus(500);
    res.send(messages);
  });
});
app.post("/messages", async (req, res) => {
  try {
    const newMessage = new MessageModel(req.body);
    newMessage.time = new Date().toLocaleString();
    await newMessage.save();
    io.emit("message", newMessage.toJSON());
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

//it is only included as a testing tool
app.delete("/messages", async (req, res) => {
  try {
    const { _id } = req.body;
    const messages = await MessageModel.find({
      _id: _id,
    });
    if (messages.length > 1) throw "there is more than 1 message";
    if (messages.length === 0) {
      res.sendStatus(204);
      return;
    }
    messages.forEach( element => element.delete());
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

io.on("connection", (socket) => {
  console.log(`Connected client on: ${socket.conn.remoteAddress}`);
});
mongoose.connect(dbUrl, {}, (error) => {
  if (error === null) return
  console.log("Connection error", error);
});
http.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
