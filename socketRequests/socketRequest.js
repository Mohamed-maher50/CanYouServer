const { io } = require("../server");
io.on("connection", (socket) => {
  socket.on("setupLocation", ({ location }) => {
    socket.join(location);
    socket.join("all");
  });
  socket.on("newRequest", (req) => {
    socket.to(req?.city).emit("receiveRequest", req);
  });
  socket.on("disconnecting", () => {
    console.log(socket.rooms.size);
  });
});
