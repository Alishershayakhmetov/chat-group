"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { message, roomData } from "../../interfaces/interfaces";
import styles from "../../styles/app.module.css";
import { ChatHeader } from "./chatHeader";
import { Message } from "../message/message";
import { MessageInput } from "./messageInput";
import { useSocketContext } from "../../contexts/socketContext";
import { Button, CircularProgress } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useChatFormContext } from "@/app/contexts/chatFormContext";
import { useChatSocketContext } from "@/app/contexts/chatSocketContext";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const { handleSetOldMessages } = useChatSocketContext();
  const fetchingRef = useRef(false);
  const scrollHeightRef = useRef(0);

  const showMessageInput =
    roomData.roomType === "chat" ||
    roomData.roomType === "group" ||
    (roomData.roomType === "channel" && isMember);

  const isInitialMount = useRef(true);
  const shouldScrollToBottom = useRef(false);

  // Scroll to bottom only on initial load or new messages at bottom
  useEffect(() => {
    if (isInitialMount.current) {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "instant" });
      }
      isInitialMount.current = false;
      return;
    }

    if (shouldScrollToBottom.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      shouldScrollToBottom.current = false;
    }
  }, [messages.length]);

  useEffect(() => {
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
      socket.off("subscribeChannel", handleSubscribeChannel);
    };
  }, [socket, roomData]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleOlderMessages = (olderMessages: message[]) => {
      if (olderMessages.length === 0) {
        setHasMoreMessages(false);
      } else {
        // 1. Store current scroll position and the height of the first visible message
        const scrollTopBefore = container.scrollTop;
        const scrollHeightBefore = container.scrollHeight;
        const firstVisibleMessage = container.querySelector(".message-visible");
        const firstMessageOffset = firstVisibleMessage
          ? firstVisibleMessage.getBoundingClientRect().top -
            container.getBoundingClientRect().top
          : 0;

        // 2. Add new messages
        handleSetOldMessages(olderMessages);

        // 3. Restore scroll position after DOM update
        requestAnimationFrame(() => {
          const scrollHeightAfter = container.scrollHeight;
          const heightAdded = scrollHeightAfter - scrollHeightBefore;

          // Calculate new scroll position to maintain view
          container.scrollTop = scrollTopBefore + heightAdded;

          // If we had a specific message in view, try to keep it visible
          if (firstVisibleMessage) {
            const newFirstMessage = container.querySelector(".message-visible");
            if (newFirstMessage) {
              const newOffset =
                newFirstMessage.getBoundingClientRect().top -
                container.getBoundingClientRect().top;
              container.scrollTop += newOffset - firstMessageOffset;
            }
          }
        });
      }
      fetchingRef.current = false;
      setLoading(false);
    };

    socket.on("olderMessages", handleOlderMessages);

    const handleScroll = () => {
      // Detect if user has scrolled to bottom (within 100px)
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      shouldScrollToBottom.current = isNearBottom;

      if (
        container.scrollTop < 100 &&
        hasMoreMessages &&
        !fetchingRef.current &&
        messages.length > 0
      ) {
        fetchingRef.current = true;
        setLoading(true);
        scrollHeightRef.current = container.scrollHeight;

        const oldestMessage = messages[0];
        socket.emit("getOlderMessages", {
          roomId: roomData.id,
          lastMessageId: oldestMessage.id,
          lastMessageCreatedAt: oldestMessage.createdAt,
        });
      }
    };

    const debouncedScrollHandler = debounce(handleScroll, 200);
    container.addEventListener("scroll", debouncedScrollHandler);

    return () => {
      container.removeEventListener("scroll", debouncedScrollHandler);
      socket.off("olderMessages", handleOlderMessages);
    };
  }, [hasMoreMessages, messages, roomData.id, handleSetOldMessages]);

  // Simple debounce function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  return (
    <div
      className={styles.contentBox}
      style={{
        height: isMessageReply ? "calc(100vh - 118px)" : "calc(100vh - 68px)",
      }}
    >
      <ChatHeader data={roomData} userStatus={userStatus} />
      <div className={styles.messageBox} ref={scrollContainerRef}>
        {loading && (
          <div className={styles.loadingMore}>
            <CircularProgress size={24} />
          </div>
        )}
        {messages.map((message: message, index) => {
          const currentDate = new Date(message.createdAt).toDateString();
          const previousDate =
            index > 0
              ? new Date(messages[index - 1].createdAt).toDateString()
              : null;

          return (
            <div key={`${message.id}-${index}`}>
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
