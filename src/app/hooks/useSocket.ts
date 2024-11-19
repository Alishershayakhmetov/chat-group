import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (serverUrl: string): React.MutableRefObject<Socket | null> => {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });
    socket.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Connected to server:", newSocket.id);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });
    
    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
    
    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });

    return () => {
      // Clean up the socket connection
      newSocket.disconnect();
    };
  }, [serverUrl]);

  return socket;
};

export default useSocket;
