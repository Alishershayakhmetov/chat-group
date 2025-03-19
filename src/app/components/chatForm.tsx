"use client";
import { useEffect, useRef, useState } from "react";
import { message, roomData } from "../interfaces/interfaces";
import styles from "../styles/app.module.css";
import { ChatHeader } from "./chatHeader";
import { Message } from "./message";
import { MessageInput } from "./messageInput";
import { useSocketContext } from "../contexts/socketContext";

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
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [messageText, setMessageText] = useState("");
  const [isMessageEdit, setIsMessageEdit] = useState(false);
  const [targetMessageId, setTargetMessageId] = useState<string | undefined>(
    undefined
  );
  const [isMessageReply, setIsMessageReply] = useState(false);

  // Scroll to the last message when messages are updated
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, []);

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

  return (
    <div className={styles.contentBox}>
      <ChatHeader data={roomData} />
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
    </div>
  );
};
