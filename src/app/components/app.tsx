"use client";
import { TextField } from "@mui/material";
import styles from "../styles/app.module.css";
import { ChatSlide } from "./chatSlide";
import { ChatHeader } from "./chatHeader";
import { Message } from "./message";
import { LeftSlide } from "./leftSlide";
import { MessageInput } from "./messageInput";
import useSocket from "../hooks/useSocket";
import ENV from "../utils/env";
import { useEffect, useState } from "react";
import { chatData, chatLastMessageData } from "../interfaces/interfaces";

export const App = () => {
  const socket = useSocket(ENV.SOCKET_URL);
  const [chats, setChats] = useState<chatData[]>([]);
  useEffect(() => {
    if (!socket.current) return;

    // Listen for the "chats" event and update the state
    socket.current.on("chats", (chatsList) => {
      setChats(chatsList);
    });
  }, [socket]);

  return (
    <main className={styles.main}>
      <section className={styles.leftSlide}>
        <header className={styles.listHeader}>
          <LeftSlide />
          <TextField
            id="outlined-basic"
            label="Find..."
            variant="outlined"
            style={{ width: "100%" }}
            size="small"
          />
        </header>
        <div className={styles.contactsList}>
          {chats.length === 0 ? (
            <div>You have no chats</div>
          ) : (
            chats.map((chat: chatData) => (
              <ChatSlide key={chat.id} data={chat.data} />
            ))
          )}
        </div>
      </section>
      <article className={styles.rightSlide}>
        <div className={styles.contentBox}>
          <ChatHeader />
          <div className={styles.messageBox}>
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />

            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />

            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />

            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />

            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
          </div>
          <MessageInput />
        </div>
      </article>
    </main>
  );
};
