import { hGetAll } from "../configs/redisClient";

const updateViewers = async (io, roomId) => {
  try {
    const roomData = await hGetAll(`room:${roomId}`);
    if (roomData) {
      const writers = roomData.writers || [];
      const ownerId = roomData.owner;
      io.to(roomId).emit("update-viewers", {
        users: roomData.users.map((user) => ({
          ...user,
          isWriter: writers.includes(user.userId),
        })),
        ownerId,
      });
    }
  } catch (error) {
    console.error(`Failed to update viewers for room ${roomId}:`, error);
  }
};

module.exports = { updateViewers };
