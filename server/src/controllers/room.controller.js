const { updateViewers } = require("../utils/socket.util");

const rooms = {};

const handleRoomEvents = (io, socket) => {
  //Create Room Event
  socket.on("create-room", ({ roomId, userData }) => {
    rooms[roomId] = {
      owner: userData.userId,
      users: [userData],
    };
    socket.join(roomId);
    socket.emit("is-owner", { isOwner: true });
    updateViewers(io, roomId, rooms);
    console.log(`Room ${roomId} created by user ${userData.userId}`);
  });

  //Check Rooom Event
  socket.on("check-room", (roomId, callback) => {
    if (rooms[roomId]) {
      callback({ exists: true });
    } else {
      callback({ exists: false });
    }
  });

  //Join Room Event
  socket.on("join-room", ({ roomId, userData }) => {
    if (rooms[roomId]) {
      if (
        !rooms[roomId].users.some((user) => user.userId === userData.userId)
      ) {
        rooms[roomId].users.push(userData);
      }
      socket.join(roomId);
      const isOwner = rooms[roomId].owner === userData.userId;
      socket.emit("is-owner", { isOwner });
      rooms[roomId].writers &&
        io.to(roomId).emit("is-writer", {
          writerId: userData.userId,
          isWriter: rooms[roomId].writers.includes(userData.userId),
        });
      rooms[roomId].writeData &&
        socket.emit("load-data", rooms[roomId].writeData);
      updateViewers(io, roomId, rooms);
      console.log(`User ${userData.userId} joined room ${roomId}\n`);
    }
  });

  //Update Display Name
  socket.on("update-display-name", ({ roomId, userData }) => {
    if (rooms[roomId]) {
      if (userData && userData.userId) {
        const userIndex = rooms[roomId].users.findIndex(
          (user) => user.userId === userData.userId
        );
        if (userIndex !== -1) {
          rooms[roomId].users[userIndex].displayName = userData.displayName;
          console.log(
            `User ${userData.userId} set their display name to ${userData.displayName}`
          );
          updateViewers(io, roomId, rooms);
        } else {
          console.error(
            `User with userId ${userData.userId} not found in room ${roomId}`
          );
        }
      } else {
        console.error("Invalid userData received:", userData);
      }
    } else {
      console.error(`Room ${roomId} does not exist`);
    }
  });

  socket.on("stop-write-user", ({ roomId }) => {
    socket.to(roomId).emit("write-user", "");
  });

  //Write
  socket.on("write", (data) => {
    const { roomId, writeData, userData } = data;
    if (
      rooms[roomId] &&
      (rooms[roomId].owner === userData.userId ||
        (rooms[roomId].writers &&
          rooms[roomId].writers.includes(userData.userId)))
    ) {
      if (!rooms[roomId].writeData) {
        rooms[roomId].writeData = [];
      }
      rooms[roomId].writeData.push(writeData);
      socket.to(roomId).emit("write-user", userData.displayName);
      socket.to(roomId).emit("write", writeData);
    }
  });

  //Allow Writing
  socket.on("allow-writing", ({ roomId, userId, writerId }) => {
    if (rooms[roomId] && rooms[roomId].owner === userId) {
      const writers = rooms[roomId].writers || [];
      if (!writers.includes(writerId)) {
        writers.push(writerId);
        rooms[roomId].writers = writers;
        updateViewers(io, roomId, rooms);
        io.to(roomId).emit("is-writer", { writerId, isWriter: true });
        console.log(`User ${userId} allowed writer ${writerId}`);
      }
    }
  });

  //Disallow Writing
  socket.on("disallow-writing", ({ roomId, userId, writerId }) => {
    if (rooms[roomId] && rooms[roomId].owner === userId) {
      const writers = rooms[roomId].writers || [];
      const writerIndex = writers.indexOf(writerId);
      if (writerIndex !== -1) {
        writers.splice(writerIndex, 1);
        rooms[roomId].writers = writers;
        updateViewers(io, roomId, rooms);
        io.to(roomId).emit("is-writer", { writerId, isWriter: false });
        console.log(`User ${userId} disallowed writer ${writerId}`);
      }
    }
  });

  //CLear Canvas
  socket.on("clear-canvas", ({ roomId, userId }) => {
    if (rooms[roomId] && rooms[roomId].owner === userId) {
      rooms[roomId].writeData = [];
      io.to(roomId).emit("clear-canvas");
    }
  });

  //Leave Room
  socket.on("leave-room", ({ roomId, userId }) => {
    if (rooms[roomId]) {
      rooms[roomId].users = rooms[roomId].users.filter(
        (user) => user.userId !== userId
      );
      if (rooms[roomId].users.length > 0) {
        io.to(roomId).emit("update-viewers", rooms[roomId].users);
      } else {
        console.log(`Room deleted`);
        delete rooms[roomId];
      }
      socket.leave(roomId);
      console.log(`User ${userId} left room ${roomId}`);
    }
  });
};

const handleDisconnect = () => {};

module.exports = { handleRoomEvents, handleDisconnect };
