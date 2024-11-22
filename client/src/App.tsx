import { createBrowserRouter, RouterProvider } from "react-router-dom";
import useSocket from "./hooks/useSocket";
import { Socket } from "socket.io-client";

import Landing from "./pages/Landing";
import Room from "./pages/Room";

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

  if (!socket || !isConnected) {
    return (
      <div className="loading-screen">
        <h1>Loading...</h1>
      </div>
    );
  }

  return <RouterProvider router={router(socket)} />;
};

export default App;
