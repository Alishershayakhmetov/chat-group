import { createContext, useContext } from "react";
import { useChatForm } from "../hooks/useChatForm";
import React from "react";

type ChatFormReturnType = ReturnType<typeof useChatForm>;

const ChatFormContext = createContext<ChatFormReturnType | null>(null);

export const ChatFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const chatForm = useChatForm();
  return (
    <ChatFormContext.Provider value={chatForm}>
      {children}
    </ChatFormContext.Provider>
  );
};

export const useChatFormContext = () => {
  const chatForm = useContext(ChatFormContext);
  if (!chatForm) {
    throw new Error(
      "useChatFormContext must be used within a ChatFormProvider"
    );
  }
  return chatForm;
};
