"use client";
import { useEffect, useRef, useState } from "react";
import { AddTempMessage, message, roomData } from "../../interfaces/interfaces";
import styles from "../../styles/app.module.css";
import { ChatHeader } from "./chatHeader";
import { Message } from "../message/message";
import { MessageInput } from "./messageInput";
import { useSocketContext } from "../../contexts/socketContext";
import { Button, CircularProgress } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useChatFormContext } from "@/app/contexts/chatFormContext";

export const ChatForm = ({
  roomData,
  messages,
}: {
  roomData: roomData;
  messages: message[];
}) => {
  const { socket, userId } = useSocketContext();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [userStatus, setUserStatus] = useState({
    userId: roomData.id,
    status: roomData.isActive ? "online" : "offline",
    lastSeen: roomData.lastActiveTime,
  });
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isMember, setIsMember] = useState(roomData.isMember);

  const { isMessageReply, handleSubscribe } = useChatFormContext();

  // Determine if MessageInput should be shown immediately
  const showMessageInput =
    roomData.roomType === "chat" ||
    roomData.roomType === "group" ||
    (roomData.roomType === "channel" && isMember);

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
          messages.map((message: message, index) => {
            const currentDate = new Date(message.createdAt).toDateString();
            const previousDate =
              index > 0
                ? new Date(messages[index - 1].createdAt).toDateString()
                : null;

            return (
              // get warning with key={message.id}
              <div key={message.id || index}>
                {currentDate !== previousDate && (
                  <div className={styles.dateDivider}>{currentDate}</div>
                )}
                <Message data={message} userId={userId} />
              </div>
            );
          })}
        <div ref={bottomRef} />
      </div>
      {showMessageInput ? (
        <MessageInput roomId={roomData.id} messages={messages} />
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
