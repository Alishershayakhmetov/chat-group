"use client";
import { TextField } from "@mui/material";
import styles from "../styles/app.module.css";
import { ChatSlide } from "./chatSlide";
import { LeftSlide } from "./settings/leftSlide";
import { useEffect, useState } from "react";
import { chatLastMessageData, searchedChats } from "../interfaces/interfaces";
import { ChatForm } from "./chat/chatForm";
import useDarkMode from "../hooks/useDarkMode";
import { useChatSearch } from "../hooks/useChatSearch";
import { useChatSocketContext } from "../contexts/chatSocketContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMobileContext } from "../contexts/mobileContext";

export const App = () => {
  const { chats, searchResults, roomData, messages } = useChatSocketContext();
  const { searchInput, handleSearchInput } = useChatSearch();
  const [isDarkMode] = useDarkMode();

  const {
    isMobile,
    handleSetIsMobile,
    showRightSlide,
    handleSetShowRightSlide,
  } = useMobileContext();

  useEffect(() => {
    const handleResize = () => handleSetIsMobile(window.innerWidth <= 812);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    // Automatically switch to chat view on mobile when room is selected
    if (isMobile && roomData) {
      handleSetShowRightSlide(true);
    } else if (isMobile && !roomData) {
      handleSetShowRightSlide(false);
    }
  }, [roomData, isMobile]);

  const handleBackToChatList = () => {
    handleSetShowRightSlide(false);
  };

  const renderChatList = () => (
    <>
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
            searchResults.map((chat: searchedChats) => (
              <ChatSlide key={chat.id} data={chat} />
            ))
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
    </>
  );

  const renderChatView = () => (
    <>{roomData && <ChatForm roomData={roomData} messages={messages} />}</>
  );

  return (
    <main className={styles.main}>
      {isMobile ? (
        <div className={styles.mobileContainer}>
          <div
            className={`${styles.mobileWrapper} ${
              showRightSlide ? styles.showRight : styles.showLeft
            }`}
          >
            <section className={styles.leftSlide}>{renderChatList()}</section>
            <article className={styles.rightSlide}>{renderChatView()}</article>
          </div>
        </div>
      ) : (
        <>
          <section className={styles.leftSlide}>{renderChatList()}</section>
          <article className={styles.rightSlide}>
            {roomData && <ChatForm roomData={roomData} messages={messages} />}
          </article>
        </>
      )}
    </main>
  );
};
