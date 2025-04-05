import { createContext, useContext } from "react";
import React from "react";
import { useChatSocket } from "../hooks/useChatSocket";

type ChatSocketReturnType = ReturnType<typeof useChatSocket>;

const ChatSocketContext = createContext<ChatSocketReturnType | null>(null);

export const ChatSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const chatSocket = useChatSocket();
  return (
    <ChatSocketContext.Provider value={chatSocket}>
      {children}
    </ChatSocketContext.Provider>
  );
};

export const useChatSocketContext = () => {
  const chatSocket = useContext(ChatSocketContext);
  if (!chatSocket) {
    throw new Error(
      "useChatSocketContext must be used within a ChatSocketProvider"
    );
  }
  return chatSocket;
};
