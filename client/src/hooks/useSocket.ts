import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (serverUrl: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(serverUrl);
    setSocket(newSocket);

      // Cleanup function to disconnect the socket when the component unmounts
      return () => {
      newSocket.disconnect();
    };
  }, [serverUrl]);

  return socket;
};

export default useSocket;
