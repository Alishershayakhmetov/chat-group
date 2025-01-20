import { useEffect, useState, useRef } from "react";
import { useSocketContext } from "../contexts/socketContext";
import {
  message,
  roomDataWithMessages,
  roomData,
} from "../interfaces/interfaces";
import styles from "../styles/app.module.css";
import { ChatHeader } from "./chatHeader";
import { Message } from "./message";
import { MessageInput } from "./messageInput";

export const ChatForm = ({
  roomData,
  messages,
  addTemp,
}: {
  roomData: roomData;
  messages: message[];
  addTemp: ({
    text,
    attachments,
  }: {
    text: string;
    attachments: {
      fileName: string;
      saveAsMedia: boolean;
      fileURL: string;
    }[];
  }) => string;
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the last message when messages are updated
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={styles.contentBox}>
      <ChatHeader data={roomData} />
      <div className={styles.messageBox}>
        {messages &&
          messages.map((message: message, index) => (
            // get wanting with key={message.id}
            <Message key={index} data={message} />
          ))}
        <div ref={bottomRef} />
      </div>
      <MessageInput roomId={roomData.id} addTemp={addTemp} />
    </div>
  );
};
