import React, { MutableRefObject, createContext, useContext } from "react";
import ENV from "../utils/env";
import useSocket from "../hooks/useSocket";
import { CustomSocket } from "../interfaces/interfaces";

const SocketContext = createContext<CustomSocket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socket: any = useSocket(ENV.SOCKET_URL);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
