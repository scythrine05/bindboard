import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { getOrCreateUserData } from "../utils";

interface LandingProps {
  socket: Socket;
}

interface RoomResponseCallback {
  exists: boolean;
}

const LandingPage: React.FC<LandingProps> = ({ socket }) => {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const userData = getOrCreateUserData();
    const newRoomId = Math.random().toString(36).substring(2, 9);
    socket && socket.emit("create-room", { roomId: newRoomId, userData });
    navigate(`/board/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = getOrCreateUserData();
    socket.emit("check-room", roomId, (response: RoomResponseCallback) => {
      if (response.exists) {
        socket && socket.emit("join-room", { roomId, userData });
        navigate(`/board/${roomId}`);
      } else {
        setError("Room not available");
      }
    });
  };

  return (
    <div>
      <button onClick={handleCreateRoom}>Create Room</button>
      <form onSubmit={handleJoinRoom}>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button type="submit">Join Room</button>
      </form>
      {error}
    </div>
  );
};

export default LandingPage;
