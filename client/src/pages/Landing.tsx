import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Socket } from "socket.io-client";
import { getOrCreateUserData } from "../utils";

import { PrimaryBtn as Button } from "../components/Button";
import InputText from "../components/InputText";

import { ErrorIcon, CreateIcon, GithubIcon } from "../assets/icons";

import "../styles/landing.style.css";

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
    <div className="landing-container">
      <header>
        <div>bindboard</div>
      </header>
      <div>
        <div className="landing-text">
          <h1>Bind your Canvas</h1>
          <p>
            Redis-powered with efficient data caching and socket programming,
            Bindboard supports live canvas collaboration with real-time user
            roles and persistent drawing data. Built for fast performance and
            seamless interaction, it’s a dynamic tool for collaborative
            creativity.
          </p>
        </div>
        <div className="landing-options">
          <div>
            <Button
              content={
                <div style={{ display: "flex", alignItems: 'center', }}>
                  <CreateIcon style={{ fontSize: "1em", marginRight: "5px" }} />
                  New Canvas
                </div>
              }
              onClick={handleCreateRoom}
            />
          </div>
          <form onSubmit={handleJoinRoom}>
            <div>
              <InputText
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <div className="landing-error">
                {error && (
                  <div>
                    <ErrorIcon
                      style={{ fontSize: "1.2em", marginRight: "5px" }}
                    />
                  </div>
                )}
                {error}
              </div>
            </div>
            <div>
              <Button content={<div>Join Canvas</div>} type="submit" />
            </div>
          </form>
        </div>
      </div>
      <footer>
        <Link to="https://github.com/scythrine05/bindboard" target="_blank">
          <div>
            <GithubIcon style={{ fontSize: "1em", marginRight: "5px" }} />
            Contribute to Github
          </div>
        </Link>
      </footer>
    </div>
  );
};

export default LandingPage;
