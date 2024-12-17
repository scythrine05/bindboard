import { createBrowserRouter, RouterProvider } from "react-router-dom";
import useSocket from "./hooks/useSocket";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

import Loading from "./pages/Loading";
import Landing from "./pages/Landing";
import Room from "./pages/Room";
import MobileView from "./pages/MobileView";

import "./App.css";

const router = (socket: Socket) =>
  createBrowserRouter([
    {
      path: "/",
      element: <Landing socket={socket} />,
    },
    {
      path: "/board/:roomId",
      element: <Room socket={socket} />,
    },
  ]);

const App: React.FC = () => {
  const { socket, isConnected } = useSocket(import.meta.env.VITE_SOCKET_URL);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (isMobile) {
    return <MobileView />;
  }

  if (!socket || !isConnected) {
    return <Loading />;
  }

  return <RouterProvider router={router(socket)} />;
};

export default App;
