import { createContext, useContext } from "react";
import React from "react";
import { useChatSearch } from "../hooks/useChatSearch";

type ChatSearchReturnType = ReturnType<typeof useChatSearch>;

const ChatSearchContext = createContext<ChatSearchReturnType | null>(null);

export const ChatSearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const chatSearch = useChatSearch();
  return (
    <ChatSearchContext.Provider value={chatSearch}>
      {children}
    </ChatSearchContext.Provider>
  );
};

export const useChatSearchContext = () => {
  const chatSearch = useContext(ChatSearchContext);
  if (!chatSearch) {
    throw new Error(
      "useChatSearchContext must be used within a ChatSearchProvider"
    );
  }
  return chatSearch;
};
