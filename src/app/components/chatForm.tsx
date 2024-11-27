import { useEffect, useState } from "react";
import { useSocketContext } from "../contexts/socketContext";
import { message, roomDataWithMessages } from "../interfaces/interfaces";
import styles from "../styles/app.module.css";
import { ChatHeader } from "./chatHeader";
import { Message } from "./message";
import { MessageInput } from "./messageInput";

export const ChatForm = ({ roomData }: { roomData: roomDataWithMessages }) => {
  return (
    <div className={styles.contentBox}>
      <ChatHeader data={roomData.roomData} />
      <div className={styles.messageBox}>
        {roomData.messages &&
          roomData.messages.map((message: message) => (
            <Message data={message} />
          ))}
      </div>
      <MessageInput roomId={roomData.roomData.id} />
    </div>
  );
};
