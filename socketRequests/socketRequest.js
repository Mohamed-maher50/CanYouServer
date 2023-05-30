const { io } = require("../server");
try {
  io.on("connection", (socket) => {
    socket.on("setupLocation", ({ location }) => {
      socket.join(location);
      socket.join("all");
    });
    socket.on("someRequestAccept", (req) => {
      socket.to(req.city).emit("acceptedRequest", req);
      // socket.to("all").emit("acceptedRequest", id);
    });
    socket.on("newRequest", (req) => {
      socket.to(req?.city).emit("receiveRequest", req);
    });
    socket.on("disconnecting", () => {
      console.log(socket.rooms.size);
    });
  });
} catch (error) {
  console.log(error);
}
