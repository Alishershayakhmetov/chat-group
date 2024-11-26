import { useState } from "react";
import { useSocketContext } from "../contexts/socketContext";
import { message, roomDataWithMessages } from "../interfaces/interfaces";
import styles from "../styles/app.module.css";
import { ChatHeader } from "./chatHeader";
import { Message } from "./message";
import { MessageInput } from "./messageInput";

export const ChatForm = () => {
  const socket = useSocketContext();
  const [roomData, setRoomData] = useState<roomDataWithMessages | null>(null);

  socket.on("enterChat", (data) => {
    console.log(data);
    setRoomData(data);
  });

  return (
    <article className={styles.rightSlide}>
      <div className={styles.contentBox}>
        <ChatHeader data={roomData?.roomData} />
        <div className={styles.messageBox}>
          {roomData?.messages.map((message: message) => (
            <Message data={message} />
          ))}
        </div>
        <MessageInput />
      </div>
    </article>
  );
};
