const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(require("cookie-parser")());
const cors = require("cors");
var morgan = require("morgan");

morgan("tiny");
app.use("/avatar", express.static(__dirname + "/uploads/avatar"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const helmet = require("helmet");
app.use(helmet());
app.use(morgan("tiny"));
require("dotenv").config();
require("./db/connection");
const PORT = process.env.PORT || 4000;
//
app.use(express.json());

app.use(require("./routes/user"));
app.use(require("./routes/Postes"));
const server = app.listen(process.env.PORT, () => {
  console.log("listen in port 4000");
});
const io = require("socket.io")(server, {
  // pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("connected");
  socket.on("setup", (roomId) => {
    console.log("setup done", roomId);
    socket.join(roomId);
  });
  socket.on("joinWith", (roomId) => {
    console.log("joinWith");
    console.log(roomId);
    socket.join(roomId);
  });
  socket.on("newMessage", ({ roomId, data }) => {
    console.log(roomId);
    console.log("first");
    console.log(socket.rooms);
    console.log(data);
    io.to(roomId).emit("receivedMessage", data);
  });
});
