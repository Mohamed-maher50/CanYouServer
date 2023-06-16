const { io } = require("../server");

io.on("connection", (socket) => {
  socket.on("setUpConnection", (id) => {
    socket.join(id);
  });
  socket.on("acceptRequest", (data) => {
    socket.emit("received");
  });
  socket.on("newMessage", (data) => {
    socket.join(data.receiver);
    socket.to(data.receiver).emit("receiveMessage", data);
    socket.leave(data.receiver);
  });
});
