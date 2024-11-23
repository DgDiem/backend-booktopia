const { Server } = require("socket.io");

let io;

module.exports = {
  init: (server) => {
    if (!io) {
      io = new Server(server, {
        cors: {
          origin: "https://backend-booktopia.onrender.com",
          methods: ["GET", "POST"],
        },
      });

      io.on("connection", (socket) => {
        console.log("A client connected:", socket.id);

        socket.on("disconnect", () => {
          console.log("Client disconnected:", socket.id);
        });
      });

      console.log("Socket.IO initialized!");
    }
    return io;
  },
  getIO: () => {
    if (!io) {
      console.error("Socket.io not initialized!");
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
