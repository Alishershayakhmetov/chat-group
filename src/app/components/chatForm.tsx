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
}: {
  roomData: roomData;
  messages: message[];
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the last message when messages are updated
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  console.log("problem with messages debug: ", messages);
  console.log(`qazqazqazqazqaz roomId roomId roomId ${roomData.id}`);

  return (
    <div className={styles.contentBox}>
      <ChatHeader data={roomData} />
      <div className={styles.messageBox}>
        {messages &&
          messages.map((message: message, index) => (
            <Message key={message.id} data={message} />
          ))}
        <div ref={bottomRef} />
      </div>
      <MessageInput roomId={roomData.id} />
    </div>
  );
};
