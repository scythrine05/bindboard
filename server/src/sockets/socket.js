// socket.js
const { Server } = require("socket.io");
const roomController = require("../controllers/room.controller");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`new socket connected: ${socket.id}`);

    roomController.handleRoomEvents(io, socket);

    socket.on("disconnect", () => {
      roomController.handleDisconnect();
    });
  });
};

module.exports = { initSocket };
