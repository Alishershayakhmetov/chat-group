import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (serverUrl: string): Socket => {
  const socket = io(serverUrl, {
    withCredentials: true,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

  socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
    
  socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
    
  socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });

  return socket;
};

export default useSocket;
