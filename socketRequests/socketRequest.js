const { io } = require("../server");
io.on("connection", (socket) => {
  socket.on("setupLocation", ({ location }) => {
    console.log(location);
    socket.join(location);
    socket.join("all");
  });
  socket.on("newRequest", (req) => {
    socket.to(req?.city).emit("receiveRequest", req);
    console.log("new requeset");
    console.log(req);
  });
  socket.on("disconnecting", () => {
    console.log(socket.rooms.size);
  });
});
