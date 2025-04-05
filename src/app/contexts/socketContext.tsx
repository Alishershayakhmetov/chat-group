import React, { createContext, useContext, useState, useEffect } from "react";
import ENV from "../utils/env";
import useSocket from "../hooks/useSocket";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket;
  userId: string | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socket = useSocket(ENV.SOCKET_URL);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (socket) {
      socket.on("userId", (id: string) => {
        setUserId(id);
      });

      return () => {
        socket.off("userId");
      };
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, userId }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
