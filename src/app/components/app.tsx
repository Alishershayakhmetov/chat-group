"use client";
import { TextField } from "@mui/material";
import styles from "../styles/app.module.css";
import { ChatSlide } from "./chatSlide";
import { ChatHeader } from "./chatHeader";
import { Message } from "./message";
import { LeftSlide } from "./leftSlide";
import { MessageInput } from "./messageInput";
import { useEffect, useRef, useState } from "react";
import {
  chatLastMessageData,
  roomDataWithMessages,
  searchedChats,
  message,
  roomData,
} from "../interfaces/interfaces";
import { useSocketContext } from "../contexts/socketContext";
import { ChatForm } from "./chatForm";

export const App = () => {
  const socket = useSocketContext();

  const [chats, setChats] = useState<chatLastMessageData[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<searchedChats[] | null>(
    null
  );
  const [roomData, setRoomData] = useState<roomData | null>(null);
  const [messages, setMessages] = useState<message[]>([]);
  /*
  // Listen for the "chats" event and update the state
  socket.on("chats", (chatsList) => {
    setChats(chatsList);
  });

  // Listen for the "searchResults" event to update the search results
  socket.on("searchResult", (results) => {
    setSearchResults(results);
  });

  socket.on("enterChat", (data) => {
    console.log("roomData: ", data);
    setRoomData(data.roomData);
    setMessages(data.messages);
  });

  socket.on("newMessage", (data) => {
    console.log(data);
    setMessages((prevMessages) => [...prevMessages, data]);
  });
  */

  useEffect(() => {
    const handleChats = (chatsList: chatLastMessageData[]) =>
      setChats(chatsList);
    const handleSearchResults = (results: searchedChats[]) =>
      setSearchResults(results);
    const handleEnterChat = (data: {
      roomData: roomData;
      messages: message[];
    }) => {
      console.log("roomData: ", data);
      setRoomData(data.roomData);
      setMessages(data.messages);
    };
    const handleNewMessage = (data: message) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    // Register event listeners
    socket.on("chats", handleChats);
    socket.on("searchResult", handleSearchResults);
    socket.on("enterChat", handleEnterChat);
    socket.on("newMessage", handleNewMessage);

    // Cleanup event listeners on unmount
    return () => {
      socket.off("chats", handleChats);
      socket.off("searchResult", handleSearchResults);
      socket.off("enterChat", handleEnterChat);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]); // Dependency array ensures this runs only once

  useEffect(() => {
    console.log(`qwert ${roomData?.id}`);
  }, [roomData]);

  useEffect(() => {
    console.log(`qwert searchInput ${searchResults}`);
  }, [searchResults]);

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
