"use client";
import { TextField } from "@mui/material";
import styles from "../styles/app.module.css";
import { ChatSlide } from "./chatSlide";
import { ChatHeader } from "./chatHeader";
import { Message } from "./message";
import { LeftSlide } from "./leftSlide";
import { MessageInput } from "./messageInput";
import { useEffect, useRef, useState } from "react";
import { chatData, searchedChats } from "../interfaces/interfaces";
import { useSocketContext } from "../contexts/socketContext";

export const App = () => {
  const socket = useSocketContext().current;

  const [chats, setChats] = useState<chatData[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<searchedChats[] | null>(
    null
  );

  useEffect(() => {
    if (!socket) return;
    // Listen for the "chats" event and update the state
    socket.on("chats", (chatsList) => {
      setChats(chatsList);
    });

    // Listen for the "searchResults" event to update the search results
    socket.on("searchResult", (results) => {
      setSearchResults(results);
    });

    return () => {
      // Cleanup listeners on unmount
      socket?.off("chats");
      socket?.off("searchResults");
    };
  }, [socket]);

  // Inside your App component
  const handleSearchInput = (() => {
    const timeout = useRef<NodeJS.Timeout | null>(null); // Use useRef to persist timeout

    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchInput(value);

      if (timeout.current) clearTimeout(timeout.current); // Clear any existing timeout

      timeout.current = setTimeout(() => {
        if (socket) {
          socket.emit("search", { query: value });
        }
      }, 300);
    };
  })();

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
            value={searchInput}
            onChange={handleSearchInput}
          />
        </header>
        <div className={styles.contactsList}>
          {searchInput && searchInput.length !== 0 && searchResults ? (
            searchResults.map((chat: searchedChats) => (
              <ChatSlide key={chat.id} data={chat} />
            ))
          ) : chats.length === 0 ? (
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
