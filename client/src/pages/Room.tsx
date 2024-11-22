import React, { useState, useEffect } from "react";
import {
  Canvas,
  Modal,
  Sidebar,
  Toolbar,
  InputText,
  PrimaryBtn as Button,
  OptionsBtn,
  ToggleBtn,
  PrimaryBtn,
  SecondaryBtn,
} from "../components";
import { Divider } from "primereact/divider";
import { Socket } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import {} from "../components";

import { getOrCreateUserData, updateUserData } from "../utils";
import {
  UserIcon,
  ErrorIcon,
  NoteIcon,
  ExitIcon,
  ClearIcon,
  OwnerIcon,
  ShareIcon,
  WriterIcon,
} from "../assets/icons";

import { UserDataTypes } from "../types";

import "../styles/room.style.css";

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
  const [displayNameModalVisible, setDisplayNameModalVisible] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  //Error
  const [error, setError] = useState("");
  //const [theme, setTheme] = useState('light');

  //Writing User
  const [writeUser, setWriteUser] = useState("");

  //Share link copy
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

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
      setDisplayNameModalVisible(false);
    } else {
      setError("Please enter a valid display name");
    }
  };

  const handleWrtingPermission = (
    value: boolean,
    userId: string,
    writerId: string
  ) => {
    if (isOwner) {
      value
        ? socket.emit("allow-writing", { roomId, userId, writerId })
        : socket.emit("disallow-writing", { roomId, userId, writerId });
    }
  };
  const handleShareLinkCopy = () => {
    if (!roomId) {
      console.error("Room ID is undefined or empty.");
      return;
    }
  
    navigator.clipboard.writeText(roomId).then(() => {
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 10000);
    }).catch((error) => {
      console.error("Failed to copy the room ID:", error);
    });
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
        <div className="sidebar-wrapper">
          <h2>Active users</h2>
          {roomData &&
            roomData.viewers.map((viewer) => (
              <div key={viewer.userId}>
                <li>
                  <div>
                    <span>
                      {viewer.userId === userData.userId
                        ? "You"
                        : viewer.displayName}
                    </span>
                    {viewer.userId === roomData.ownerId ? (
                      <OwnerIcon style={{ marginLeft: "10px" }} />
                    ) : viewer.isWriter ? (
                      <WriterIcon style={{ marginLeft: "10px" }} />
                    ) : null}
                  </div>
                  {isOwner &&
                    (viewer.userId === userData.userId ? null : (
                      <ToggleBtn
                        onChange={(e) =>
                          handleWrtingPermission(
                            e.value,
                            userData.userId,
                            viewer.userId
                          )
                        }
                        checked={viewer.isWriter}
                      />
                    ))}
                </li>
                <Divider layout="horizontal" />
              </div>
            ))}
        </div>
      </Sidebar>
      <Modal
        header="Type display name"
        visible={displayNameModalVisible}
        onHide={() => {
          if (!displayNameModalVisible) return;
          setDisplayNameModalVisible(false);
        }}
      >
        <div className="displayname-modal">
          <form onSubmit={handleDisplayNameSubmit}>
            <InputText
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              max={20}
            />
            <div className="displayname-modal-error">
              {error && (
                <div>
                  <ErrorIcon
                    style={{ fontSize: "1.2em", marginRight: "5px" }}
                  />
                </div>
              )}
              {error}
            </div>
            <div>
              <Button content="Enter canvas" type="submit" />
            </div>
          </form>
          <div className="displayname-modal-note">
            <div>
              <NoteIcon style={{ fontSize: "1.2em", marginRight: "5px" }} />
            </div>
            <p>
              The given name would be displayed as your identification in the
              canvas
            </p>
          </div>
        </div>
      </Modal>
      <Modal
        header="Share canvas"
        visible={shareModalVisible}
        onHide={() => {
          if (!shareModalVisible) return;
          setShareModalVisible(false);
        }}
        dismissableMask={true}
      >
        <div className="share-modal-wrapper">
          <p>Copy the code and share the canvas.</p>
          <InputText value={`${roomId}`} readOnly={true} />
          {shareLinkCopied ? (
            <SecondaryBtn
              onClick={handleShareLinkCopy}
              content={"Copied code"}
            />
          ) : (
            <PrimaryBtn onClick={handleShareLinkCopy} content={"Copy code"} />
          )}
        </div>
      </Modal>
      {writeUser && (
        <div className="current-writer">{writeUser} is writing</div>
      )}
      {isOwner && (
        <OptionsBtn
          onClick={handleClearCanvas}
          style={{ top: 0, right: "8em" }}
          content={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#000000",
              }}
            >
              <ClearIcon
                style={{
                  fontSize: "1.2em",
                  marginRight: "10px",
                }}
              />
              Clear canvas
            </div>
          }
        />
      )}
      {(isOwner || isWriter) && (
        <Toolbar
          setColor={setColor}
          setThickness={setThickness}
          setTool={setTool}
        />
      )}
      <OptionsBtn
        style={{ top: 0, right: "1em" }}
        onClick={() => setSidebarVisible(true)}
        content={<UserIcon style={{ fontSize: "1.2em", color: "#000000" }} />}
      />
      <OptionsBtn
        style={{ top: 0, right: "4em" }}
        onClick={() => setShareModalVisible(true)}
        content={<ShareIcon style={{ fontSize: "1.2em", color: "#000000" }} />}
      />
      <OptionsBtn
        style={{ top: 0, left: "1em" }}
        onClick={handleLeaveRoom}
        content={
          <div
            style={{ display: "flex", alignItems: "center", color: "#000000" }}
          >
            <ExitIcon
              style={{
                fontSize: "1.2em",
                marginRight: "10px",
              }}
            />
            Leave canvas
          </div>
        }
      />
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
