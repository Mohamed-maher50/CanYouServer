const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
// app.use(require("cookie-parser")());
const cors = require("cors");
var morgan = require("morgan");
app.use(express.json());

app.use(express.text());
morgan("tiny");
app.use("/avatar", express.static(__dirname + "/uploads/avatar"));
app.use(cors());
const helmet = require("helmet");
app.use(helmet());

app.use(morgan("tiny"));

require("dotenv").config();
require("./db/connection");
const PORT = process.env.PORT || 4000;
//

app.use(require("./routes/ChatRoute"));
app.use(require("./routes/user"));
app.use(require("./routes/Postes"));
app.use("/api", require("./routes/Requests"));
app.use((req, res) => {
  res.status(404).json({ msg: "not found this route" });
});
const server = app.listen(PORT, () => {
  console.log("listen in port 4000");
});
const io = require("socket.io")(server, {
  pingTimeout: 1000,
  cors: {
    origin: "*",
  },
});
module.exports = {
  io,
};
require("./socketRequests/socketRequest");
io.on("connection", (socket) => {
  socket.on("setup", (roomId) => {
    socket.join(roomId);
  });
  socket.on("joinWith", (roomId) => {
    socket.join(roomId);
  });
  socket.on("newMessage", ({ roomId, data }) => {
    io.to(roomId).emit("receivedMessage", data);
  });
});
