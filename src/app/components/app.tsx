"use client";
import { TextField } from "@mui/material";
import styles from "../styles/app.module.css";
import { ChatSlide } from "./chatSlide";
import { LeftSlide } from "./settings/leftSlide";
import { useEffect } from "react";
import { chatLastMessageData, searchedChats } from "../interfaces/interfaces";
import { ChatForm } from "./chat/chatForm";
import useDarkMode from "../hooks/useDarkMode";
import { useChatSearch } from "../hooks/useChatSearch";
import { useChatSocketContext } from "../contexts/chatSocketContext";

export const App = () => {
  const { chats, searchResults, roomData, messages } = useChatSocketContext();
  const { searchInput, handleSearchInput } = useChatSearch();
  const [isDarkMode] = useDarkMode();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

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
          {searchInput && searchInput.length !== 0 ? (
            searchResults && searchResults.length !== 0 ? (
              searchResults.map((chat: searchedChats) => {
                return <ChatSlide key={chat.id} data={chat} />;
              })
            ) : (
              <div>No result</div>
            )
          ) : chats.length === 0 ? (
            <div>You have no chats</div>
          ) : (
            chats.map((chat: chatLastMessageData) => (
              <ChatSlide key={chat.roomId} data={chat} />
            ))
          )}
        </div>
      </section>
      <article className={styles.rightSlide}>
        {roomData && <ChatForm roomData={roomData} messages={messages} />}
      </article>
    </main>
  );
};
