import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (socket) return;
    const url = io("http://localhost:4000");
    setSocket(url);
  }, []);
  return socket;
};
