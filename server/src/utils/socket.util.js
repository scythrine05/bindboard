const updateViewers = (io, roomId, rooms) => {
    rooms[roomId] && 
      io.to(roomId).emit('update-viewers', {
        users: rooms[roomId].users.map((user) => ({
          userId: user.userId,
          displayName: user.displayName || 'Unknown',
          isWriter: Array.isArray(rooms[roomId].writers)
            ? rooms[roomId].writers.includes(user.userId)
            : false,
        })),
        ownerId: rooms[roomId].owner,
      });
  };
  
  module.exports = { updateViewers };
  