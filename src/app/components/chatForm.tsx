"use client";
import { useEffect, useRef, useState } from "react";
import { message, roomData } from "../interfaces/interfaces";
import styles from "../styles/app.module.css";
import { ChatHeader } from "./chatHeader";
import { Message } from "./message";
import { MessageInput } from "./messageInput";
import { useSocketContext } from "../contexts/socketContext";
import { Button, CircularProgress } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

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
      fileSize: number;
    }[];
  }) => string;
}) => {
  const socket = useSocketContext();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [messageText, setMessageText] = useState("");
  const [isMessageEdit, setIsMessageEdit] = useState(false);
  const [targetMessageId, setTargetMessageId] = useState<string | undefined>(
    undefined
  );
  const [isMessageReply, setIsMessageReply] = useState(false);
  const [userStatus, setUserStatus] = useState({
    userId: roomData.id,
    status: roomData.isActive ? "online" : "offline",
    lastSeen: roomData.lastActiveTime,
  });

  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isMember, setIsMember] = useState(roomData.isMember);

  // Determine if MessageInput should be shown immediately
  const showMessageInput =
    roomData.roomType === "chat" ||
    roomData.roomType === "group" ||
    (roomData.roomType === "channel" && isMember);

  // Scroll to the last message when messages are updated
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }

    setIsMember(roomData.isMember);

    const handleUserStatusNotification = ({
      userId,
      status,
      lastSeen,
    }: {
      userId: string;
      status: "online" | "offline";
      lastSeen: string | undefined;
    }) => {
      setUserStatus({ userId, status, lastSeen });
    };
    const handleSubscribeChannel = ({ success }: { success: boolean }) => {
      setIsSubscribing(false);
      setIsMember(success);
    };

    socket.on("userStatusNotification", handleUserStatusNotification);
    socket.on("subscribeChannel", handleSubscribeChannel);

    return () => {
      socket.off("userStatusNotification", handleUserStatusNotification);
    };
  }, [socket, roomData]);

  const handleEditMessage = ({
    messageId,
    messageText,
  }: {
    messageId: string;
    messageText: string;
  }) => {
    setIsMessageEdit(true);
    setTargetMessageId(messageId);
    setMessageText(messageText);
  };

  const handleReplyMessage = ({ messageId }: { messageId: string }) => {
    setIsMessageReply(true);
    setTargetMessageId(messageId);
  };

  const handleSubscribe = (roomId: string) => {
    socket.emit("subscribe", roomId);
  };

  return (
    <div
      className={styles.contentBox}
      style={{
        height: isMessageReply ? "calc(100vh - 118px)" : "calc(100vh - 68px)",
      }}
    >
      <ChatHeader data={roomData} userStatus={userStatus} />
      <div className={styles.messageBox}>
        {messages &&
          messages.map((message: message, index) => (
            // get warning with key={message.id}
            <Message
              key={index}
              data={message}
              handleEditMessage={handleEditMessage}
              handleReplyMessage={handleReplyMessage}
            />
          ))}
        <div ref={bottomRef} />
      </div>
      {showMessageInput ? (
        <MessageInput
          roomId={roomData.id}
          addTemp={addTemp}
          messageText={messageText}
          setMessageText={setMessageText}
          isMessageEdit={isMessageEdit}
          targetMessageId={targetMessageId}
          setIsMessageEdit={setIsMessageEdit}
          setTargetMessageId={setTargetMessageId}
          isMessageReply={isMessageReply}
          setIsMessageReply={setIsMessageReply}
          messages={messages}
        />
      ) : (
        <Button
          variant="contained"
          color="primary"
          startIcon={
            isSubscribing ? (
              <CircularProgress size={20} />
            ) : (
              <AddCircleOutlineIcon />
            )
          }
          onClick={() => handleSubscribe(roomData.id)}
          disabled={isSubscribing}
          sx={{
            padding: "10px 20px",
            fontSize: "16px",
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          {isSubscribing ? "Subscribing..." : "Subscribe"}
        </Button>
      )}
    </div>
  );
};
