const express = require("express");
const app = express();
const cors = require("cors");
var morgan = require("morgan");
const helmet = require("helmet");

const PORT = process.env.PORT || 4000;
// server configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());
morgan("tiny");
app.use(
  cors({
    origin: [
      "https://shopapp-8faf7.firebaseapp.com",
      "https://canyou-6d6aa.web.app",
      "http://localhost:3000",
      "*",
    ],
    credentials: true,
  })
);
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
require("dotenv").config();
require("./db/connection");

// routes

app.use("/api/playlist", require("./routes/playlists/playlists"));
app.use("/api/chat/", require("./routes/Chat"));
app.use("/auth", require("./routes/Auth"));
app.use("/api/user", require("./routes/user/user"));
app.use("/api/posts/", require("./routes/posts/Posts"));
app.use("/notification", require("./routes/Notification"));
app.use("/api", require("./routes/Requests"));

// message for not found this route
app.use((req, res) => {
  res.status(404).json({ msg: "not found this route" });
});

// server listen
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

try {
  require("./web/socketRequest");
  require("./web/Chat");
} catch (error) {
  console.log(error);
}
