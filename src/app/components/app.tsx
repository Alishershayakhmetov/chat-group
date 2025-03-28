"use client";
import { TextField } from "@mui/material";
import styles from "../styles/app.module.css";
import { ChatSlide } from "./chatSlide";
import { LeftSlide } from "./leftSlide";
import { useEffect, useRef, useState } from "react";
import {
  chatLastMessageData,
  searchedChats,
  message,
  roomData,
  MessageStatus,
} from "../interfaces/interfaces";
import { useSocketContext } from "../contexts/socketContext";
import { ChatForm } from "./chatForm";
import { v4 as uuid } from "uuid";
import useDarkMode from "../hooks/useDarkMode";

export const App = () => {
  const socket = useSocketContext();

  const [chats, setChats] = useState<chatLastMessageData[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<searchedChats[] | null>(
    null
  );
  const [roomData, setRoomData] = useState<roomData | null>(null);
  const [messages, setMessages] = useState<message[]>([]);
  const [isDarkMode, setIsDarkMode] = useDarkMode();

  useEffect(() => {
    const handleChats = (chatsList: chatLastMessageData[]) =>
      setChats(chatsList);
    const handleSearchResults = (results: searchedChats[]) =>
      setSearchResults(results);
    const handleEnterChat = (data: {
      roomData: roomData;
      messages: message[];
    }) => {
      setRoomData(data.roomData);
      setMessages(data.messages);
    };
    const handleNewMessage = (data: message) => {
      setMessages((prevMessages) => {
        const DuplicateIndex = prevMessages.findIndex(
          (message) => message.tempId === data.tempId
        );

        if (DuplicateIndex !== -1) {
          // Replace the existing message with the new data
          console.log("Duplicate message replaced:", data);
          const updatedMessages = [...prevMessages];
          updatedMessages[DuplicateIndex] = data;
          return updatedMessages;
        }

        // Add new message to the array
        return [...prevMessages, data];
      });
    };

    const handleCreateNewGroup = (newGroup: chatLastMessageData) => {
      setChats((prevChats) => [newGroup, ...prevChats]);
    };

    const handleCreateNewChannel = (newChannel: chatLastMessageData) => {
      setChats((prevChats) => [newChannel, ...prevChats]);
    };

    const handleDeleteMessage = (messageId: string) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    };

    const handleEditMessage = (formattedMessage: message) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === formattedMessage.id
            ? { ...msg, ...formattedMessage } // Merge updated properties
            : msg
        )
      );
    };

    const handleNewMessageNotification = (message: {
      roomId: any;
      userName: string | null | undefined;
      userId: string;
      text: string | null;
      isAttachment: boolean;
      lastMessageTime: String;
    }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.roomId === message.roomId
            ? {
                ...chat,
                messageUserName: message.userName || "noName",
                messageText: message.text || "",
                lastMessageTime: message.lastMessageTime.toString(),
              }
            : chat
        )
      );
    };

    // Register event listeners
    socket.on("chats", handleChats);
    socket.on("searchResult", handleSearchResults);
    socket.on("enterChat", handleEnterChat);
    socket.on("newMessage", handleNewMessage);
    socket.on("createNewGroup", handleCreateNewGroup);
    socket.on("createNewChannel", handleCreateNewChannel);
    socket.on("deleteMessage", handleDeleteMessage);
    socket.on("editMessage", handleEditMessage);
    socket.on("newMessageNotification", handleNewMessageNotification);

    // Cleanup event listeners on unmount
    return () => {
      socket.off("chats", handleChats);
      socket.off("searchResult", handleSearchResults);
      socket.off("enterChat", handleEnterChat);
      socket.off("newMessage", handleNewMessage);
      socket.off("createNewGroup", handleCreateNewGroup);
      socket.off("createNewChannel", handleCreateNewChannel);
      socket.off("deleteMessage", handleDeleteMessage);
      socket.off("editMessage", handleEditMessage);
      socket.off("newMessageNotification", handleNewMessageNotification);
    };
  }, [socket]); // Dependency array ensures this runs only once

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleAddTempMessage = ({
    text,
    attachments,
  }: {
    text: string;
    attachments: {
      fileName: string;
      saveAsMedia: boolean;
      fileURL: string;
      fileSize: number;
    }[];
  }) => {
    const tempId = uuid();
    const tempMes: message = {
      tempId,
      text,
      attachments,
      updatedAt: new Date(),
      createdAt: new Date(),
      isEdited: false,
      status: MessageStatus.Sending,
    };

    setMessages((prevMessage) => [...prevMessage, tempMes]);
    return tempId;
  };

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
        {roomData && (
          <ChatForm
            roomData={roomData}
            messages={messages}
            addTemp={handleAddTempMessage}
          />
        )}
      </article>
    </main>
  );
};
