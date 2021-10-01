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
    console.log(error);
    res.sendStatus(500);
  } finally {
    console.log("finally called");
  }
});

io.on("connection", (socket) => {
  console.log(`Connected client on: ${socket.conn.remoteAddress}`);
});
mongoose.connect(dbUrl, {}, (error) => {
  console.log("Connection error", error);
});
http.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
