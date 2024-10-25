import React, { useState, useEffect } from "react";
import { Canvas, Modal, InputSwitch, Sidebar, Toolbar } from "../components";
import { Socket } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { getOrCreateUserData, updateUserData } from "../utils";

import { UserDataTypes } from "../types";

interface RoomProps {
  socket: Socket;
}

interface User {
  userId: string;
  displayName: string;
  isWriter: boolean;
}

interface RoomData {
  ownerId: string;
  viewers: User[];
}

const Room: React.FC<RoomProps> = ({ socket }) => {
  //displayname
  const [displayName, setDisplayName] = useState("");
  //IsOwner
  const [isOwner, setIsOwner] = useState<boolean>(false);
  //isWriter
  const [isWriter, setIsWriter] = useState<boolean>(false);
  //Room-Data
  const [roomData, setRoomData] = useState<RoomData>();

  //Toolbar
  const [color, setColor] = useState<string>("#000000");
  const [thickness, setThickness] = useState<number>(5);
  const [tool, setTool] = useState("pencil");

  //Components State
  const [modalVisible, setModalVisible] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  //Error
  const [error, setError] = useState("");
  //const [theme, setTheme] = useState('light');

  //Writing User
  const [writeUser, setWriteUser] = useState("");

  const { roomId } = useParams();
  const navigate = useNavigate();
  const userData: UserDataTypes = getOrCreateUserData();

  useEffect(() => {
    if (socket) {
      socket.on("is-owner", ({ isOwner }) => setIsOwner(isOwner));
      socket.on("write-user", (user) => setWriteUser(user));
      socket.on("update-viewers", ({ users, ownerId }) => {
        if (users && users.length) {
          const updatedViewers = users.map((user: User) => {
            return {
              userId: user.userId,
              displayName: user.displayName || "Unknown",
              isWriter: user.isWriter,
            };
          });
          const newRoomData = {
            ownerId,
            viewers: updatedViewers, // assign updated viewers to users
          };

          setRoomData(newRoomData); // update the state
        }
      });
      socket.on(
        "is-writer",
        ({ writerId, isWriter }) =>
          writerId === userData.userId && setIsWriter(isWriter)
      );
      socket.on("connect", () => {
        socket.emit("join-room", { roomId, userData });
      });

      return () => {
        socket.off("is-owner");
        socket.off("write-user");
        socket.off("update-viewers");
        socket.off("is-writer");
        socket.off("connect");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (userData && userData.displayName) {
      setDisplayName(userData.displayName);
    }
  }, []);

  const handleClearCanvas = () => {
    isOwner && userData
      ? socket.emit("clear-canvas", { roomId, userId: userData.userId })
      : null;
  };

  const handleLeaveRoom = () => {
    socket.emit("leave-room", { roomId, userId: userData.userId });
    navigate("/"); // Navigate back to the landing page
  };

  const handleDisplayNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      updateUserData(displayName);
      const updatedUserData: UserDataTypes = getOrCreateUserData();
      socket.emit("update-display-name", { roomId, userData: updatedUserData });
      setModalVisible(false);
    } else {
      setError("Please enter a valid display name");
    }
  };

  const handleWrtingPermission = (
    e: React.FormEvent,
    userId: string,
    writerId: string
  ) => {
    const isChecked = (e.target as HTMLInputElement).checked;
    if (isOwner) {
      isChecked
        ? socket.emit("allow-writing", { roomId, userId, writerId })
        : socket.emit("disallow-writing", { roomId, userId, writerId });
    }
  };

  return (
    <div>
      <Sidebar
        visible={sidebarVisible}
        onHide={() => {
          if (!sidebarVisible) return;
          setSidebarVisible(false);
        }}
      >
        <h3>Current Viewers</h3>
        {roomData &&
          roomData.viewers.map((viewer) => (
            <li key={viewer.userId}>
              <div>
                <span>
                  {viewer.userId === userData.userId
                    ? "You"
                    : viewer.displayName}
                </span>
                {viewer.userId === roomData.ownerId
                  ? "(Admin)"
                  : viewer.isWriter
                  ? "(Writer)"
                  : null}
                <br />
                {isOwner &&
                  (viewer.userId === userData.userId ? null : (
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleWrtingPermission(e, userData.userId, viewer.userId)
                      }
                      checked={viewer.isWriter}
                    />
                  ))}
              </div>
            </li>
          ))}
      </Sidebar>
      <Modal
        visible={modalVisible}
        onHide={() => {
          if (!modalVisible) return;
          setModalVisible(false);
        }}
      >
        <div>
          <form onSubmit={handleDisplayNameSubmit}>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
            <button type="submit">enter</button>
          </form>
          <div>{error}</div>
        </div>
      </Modal>
      <div>{writeUser && <>{writeUser} is Writing</>}</div>
      {isOwner && <button onClick={handleClearCanvas}>Clear Canvas</button>}
      {(isOwner || isWriter) && (
        <Toolbar
          setColor={setColor}
          setThickness={setThickness}
          setTool={setTool}
          // toggleTheme={toggleTheme}
          // theme={theme}
        />
      )}
      <button onClick={() => setSidebarVisible(true)}>Users</button>
      <button onClick={handleLeaveRoom}>Leave Room</button>
      {socket && (
        <Canvas
          tool={tool}
          socket={socket}
          color={color}
          thickness={thickness}
          isOwner={isOwner}
          isWriter={isWriter}
        />
      )}
    </div>
  );
};

export default Room;
