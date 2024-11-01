const { updateViewers } = require("../utils/socket.util");
const { redisClient, del, hSet, hGetAll } = require("../configs/redisClient");
const { EXPIRE_TIME } = require("../utils/constants");

const handleRoomEvents = (io, socket) => {
  //Create Room Event
  socket.on("create-room", async ({ roomId, userData }) => {
    const roomKey = `room:${roomId}`;
    try {
      await hSet(roomKey, "owner", userData.userId);
      await hSet(roomKey, "users", [userData]);
      await hSet(roomKey, "writers", []);
      await hSet(roomKey, "writeData", []);
      await redisClient.expire(roomKey, EXPIRE_TIME);
      socket.join(roomId);
      socket.emit("is-owner", { isOwner: true });
      await updateViewers(io, roomId);
      console.log(`Room ${roomId} created by user ${userData.userId}`);
    } catch (err) {
      console.error("Error creating room in Redis:", err);
    }
  });

  //Check Rooom Event
  socket.on("check-room", async (roomId, callback) => {
    const roomExists = await redisClient.exists(`room:${roomId}`);
    callback({ exists: roomExists === 1 });
  });

  //Join Room Event
  socket.on("join-room", async ({ roomId, userData }) => {
    const room = await hGetAll(`room:${roomId}`);
    if (room && room.users) {
      const users = room.users;
      const writers = room.writers || [];

      if (!users.some((user) => user.userId === userData.userId)) {
        users.push(userData);
      }

      await hSet(`room:${roomId}`, "users", users);

      await redisClient.expire(`room:${roomId}`, EXPIRE_TIME);

      socket.join(roomId);
      const isOwner = room.owner === userData.userId;
      socket.emit("is-owner", { isOwner });
      io.to(roomId).emit("is-writer", {
        writerId: userData.userId,
        isWriter: writers.includes(userData.userId),
      });
      room.writeData && socket.emit("load-data", room.writeData);
      await updateViewers(io, roomId);
      console.log(`User ${userData.userId} joined room ${roomId}`);
    }
  });

  //Update Display Name
  socket.on("update-display-name", async ({ roomId, userData }) => {
    const room = await hGetAll(`room:${roomId}`);
    if (room && room.users) {
      const users = room.users;
      const userIndex = users.findIndex(
        (user) => user.userId === userData.userId
      );
      if (userIndex !== -1) {
        users[userIndex].displayName = userData.displayName;
        await hSet(`room:${roomId}`, "users", users);
        console.log(
          `User ${userData.userId} set their display name to ${userData.displayName}`
        );
        await updateViewers(io, roomId);
      }
    }
  });

  socket.on("stop-write-user", ({ roomId }) => {
    socket.to(roomId).emit("write-user", "");
  });

  //Write
  socket.on("write", async (data) => {
    const { roomId, writeData, userData } = data;
    const room = await hGetAll(`room:${roomId}`);
    if (room && room.users) {
      const isOwner = room.owner === userData.userId;
      const writers = room.writers || [];

      if (isOwner || writers.includes(userData.userId)) {
        const currentWriteData = room.writeData || [];
        currentWriteData.push(writeData);
        await hSet(`room:${roomId}`, "writeData", currentWriteData);

        socket.to(roomId).emit("write-user", userData.displayName);
        socket.to(roomId).emit("write", writeData);
      }
    }
  });

  //Allow Writing
  socket.on("allow-writing", async ({ roomId, userId, writerId }) => {
    const room = await hGetAll(`room:${roomId}`);
    if (room && room.owner === userId) {
      const writers = room.writers || [];
      if (!writers.includes(writerId)) {
        writers.push(writerId);
        await hSet(`room:${roomId}`, "writers", writers);

        await updateViewers(io, roomId);
        io.to(roomId).emit("is-writer", { writerId, isWriter: true });
        console.log(`User ${userId} allowed writer ${writerId}`);
      }
    }
  });

  //Disallow Writing
  socket.on("disallow-writing", async ({ roomId, userId, writerId }) => {
    const room = await hGetAll(`room:${roomId}`);
    if (room && room.owner === userId) {
      const writers = room.writers || [];
      const writerIndex = writers.indexOf(writerId);
      if (writerIndex !== -1) {
        writers.splice(writerIndex, 1);
        await hSet(`room:${roomId}`, "writers", writers);

        await updateViewers(io, roomId);
        io.to(roomId).emit("is-writer", { writerId, isWriter: false });
        console.log(`User ${userId} disallowed writer ${writerId}`);
      }
    }
  });

  //CLear Canvas
  socket.on("clear-canvas", async ({ roomId, userId }) => {
    const room = await hGetAll(`room:${roomId}`);
    if (room && room.owner === userId) {
      await hSet(`room:${roomId}`, "writeData", []);
      io.to(roomId).emit("clear-canvas");
    }
  });

  //Leave Room

  socket.on("leave-room", async ({ roomId, userId }) => {
    const room = await hGetAll(`room:${roomId}`);
    if (room && room.users) {
      const users = room.users.filter((user) => user.userId !== userId);
      if (users.length > 0) {
        await hSet(`room:${roomId}`, "users", users);
        io.to(roomId).emit("update-viewers", users);
      } else {
        await del(`room:${roomId}`);
        console.log(`Room ${roomId} deleted`);
      }
      socket.leave(roomId);
      console.log(`User ${userId} left room ${roomId}`);
    }
  });
};

const handleDisconnect = () => {};

module.exports = { handleRoomEvents, handleDisconnect };
