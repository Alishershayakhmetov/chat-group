"use client";
import styles from "../styles/messageInput.module.css";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import { IconButton, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MicIcon from "@mui/icons-material/Mic"; // Mic icon for voice
import SendIcon from "@mui/icons-material/Send"; // Send icon
import { useSocketContext } from "../contexts/socketContext";
import axios from "axios";
import { message } from "../interfaces/interfaces";
import { v4 as uuid } from "uuid";
import SelectFiles from "./selectFiles";

import { Close as CloseIcon, Reply } from "@mui/icons-material";

interface FileAttachmentProps {
  onFileSelect: (file: File) => void;
}

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
}

const ariaLabel = { "aria-label": "Type message box" };

export const MessageInput = ({
  roomId,
  addTemp,
  messageText,
  setMessageText,
  isMessageEdit,
  targetMessageId,
  setIsMessageEdit,
  setTargetMessageId,
  isMessageReply,
  setIsMessageReply,
  messages,
}: {
  roomId: string;
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
  messageText: string;
  setMessageText: Dispatch<SetStateAction<string>>;
  isMessageEdit: boolean;
  targetMessageId: string | undefined;
  setIsMessageEdit: Dispatch<SetStateAction<boolean>>;
  setTargetMessageId: Dispatch<SetStateAction<string | undefined>>;
  isMessageReply: boolean;
  setIsMessageReply: Dispatch<SetStateAction<boolean>>;
  messages: message[];
}) => {
  // const [message, setMessage] = useState("");
  const [files, setFiles] = useState<{ file: File; saveAsMedia: boolean }[]>(
    []
  );
  const [showFileWindow, setShowFileWindow] = useState(false);
  const socket = useSocketContext();

  const handleSetText = (text: string) => {
    setMessageText(text);
  };
  const handleCloseWindow = () => {
    setFiles([]);
    setShowFileWindow(false);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    saveAsMedia = true
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles).map((file) => ({
        file,
        saveAsMedia,
      }));

      if (files.length + fileArray.length > 10) {
        alert("You can only attach up to 10 files.");
        return;
      }

      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
      setShowFileWindow(true);
    }
  };

  // Remove a specific file
  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleFileTypeChange = (index: number) => {
    setFiles(
      files.map((file, ind) => {
        if (ind === index) {
          return { ...file, saveAsMedia: !file.saveAsMedia };
        }
        return file;
      })
    );
  };

  const handleEmojiClick = () => {
    // Placeholder for actual emoji picker or you can open an emoji picker library
    const emoji = "😊"; // Example emoji
    setMessageText(messageText + emoji); // Send the emoji to parent component
  };

  const handleSend = async () => {
    if (!messageText.trim() && files.length === 0) {
      alert("Cannot send an empty message.");
      return;
    }

    const text = messageText.trim();

    if (isMessageEdit && targetMessageId) {
      console.log("message editing");
      socket.emit("editMessage", {
        messageId: targetMessageId,
        editedText: messageText,
      });
      setIsMessageEdit(false);
      setTargetMessageId(undefined);
      setMessageText("");
      return;
    }

    const attachments = files.map((file) => ({
      fileName: file.file.name,
      saveAsMedia: file.saveAsMedia,
      fileURL: URL.createObjectURL(file.file),
      fileSize: file.file.size,
    }));
    const tempId = addTemp({ text, attachments });

    try {
      // Extract file extensions
      const extensions = files.map((file) => {
        const parts = file.file.name.split(".");
        return parts.length > 1 ? parts.pop() : ""; // Handle files without extensions
      });

      // Request signed upload URLs for files
      const result = await axios.post("http://localhost:3005/upload", {
        extensions,
      });

      const urls: { url: string; key: string }[] = result.data.urls;

      // Upload files to signed URLs
      const uploadPromises = files.map((file, index) => {
        const fileUrl = urls[index].url;
        return axios.put(fileUrl, file.file, {
          headers: {
            "Content-Type": file.file.type,
          },
        });
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      // Prepare the list of uploaded file URLs and metadata
      const uploadedFiles = urls.map(
        (url: { url: string; key: string }, index: number) => ({
          key: url.key,
          name: files[index].file.name,
          url: url.url.split("?")[0], // Remove query parameters from URL
          saveAsMedia: files[index].saveAsMedia,
          fileSize: files[index].file.size,
        })
      );

      // Emit message event with text and attachments
      const payload = {
        roomId,
        text: messageText.trim(),
        attachments: uploadedFiles,
        tempId,
        originalMessageId: isMessageReply ? targetMessageId : null,
      };

      socket.emit("sendMessage", payload);

      // Clear input fields and file attachments
      setMessageText("");
      setFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleVoiceRecord = () => {
    // Add logic for starting voice recording
  };

  return (
    <div className={styles.messageInputBox}>
      <div className={styles.leftBox}>
        {isMessageReply && targetMessageId && (
          <div className={styles.replyBox}>
            <div>
              <Reply sx={{ fontSize: 40 }} />
            </div>
            <div>
              {messages
                .filter((msg) => msg.id === targetMessageId) // Find the matching message
                .map((msg) => (
                  <div key={msg.id}>
                    <Typography>{msg.text}</Typography>
                  </div>
                ))}
            </div>
            <div>
              <CloseIcon
                className="SVGColorController"
                sx={{ fontSize: 40 }}
                onClick={() => setIsMessageReply(false)}
              />
            </div>
          </div>
        )}
        <div className={styles.inputBox}>
          <div>
            {/* emoji selection container */}
            <IconButton
              onClick={handleEmojiClick}
              sx={{ color: "var(--color-text-default)" }}
            >
              <EmojiEmotionsIcon sx={{ fontSize: "28px" }} />
            </IconButton>
          </div>
          <div>
            <Box
              component="form"
              sx={{ "& > :not(style)": { m: 1 } }}
              noValidate
              autoComplete="off"
            >
              <Input
                placeholder="Type message..."
                inputProps={ariaLabel}
                multiline
                fullWidth
                value={messageText}
                onChange={(e) => handleSetText(e.target.value)}
                sx={{
                  color: "var(--color-text-default)",
                  "&::before": {
                    borderBottom: "1px solid white !important", // Default underline color
                  },
                  "&::after": {
                    borderBottom: "2px solid hsl(194, 31%, 27%) !important", // focused underline color
                  },
                  "&:hover:not(.Mui-disabled):before": {
                    borderBottom: "1px solid white !important", // Hover effect
                  },
                }}
              />
            </Box>
          </div>
          <div>
            <input
              type="file"
              id="file-upload"
              multiple
              style={{ display: "none", color: "var(--color-text-default)" }} // Hide the default file input
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <IconButton
                component="span"
                sx={{ color: "var(--color-text-default)" }}
              >
                <AttachFileIcon />
              </IconButton>
            </label>
          </div>
        </div>
      </div>
      <div className={styles.rightBox}>
        {/* Voice message or Send button */}
        {messageText || files.length ? (
          <IconButton
            onClick={handleSend}
            disabled={!messageText && files.length == 0}
            className={styles.fade}
            sx={{ color: "var(--color-text-default)" }}
          >
            <SendIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={handleVoiceRecord}
            className={styles.fade}
            sx={{ color: "var(--color-text-default)" }}
          >
            <MicIcon />
          </IconButton>
        )}
      </div>
      {/* Display attached files */}
      {showFileWindow && (
        <SelectFiles
          files={files}
          text={messageText}
          onDeleteFile={handleRemoveFile}
          onClose={handleCloseWindow}
          onTextChange={handleSetText}
          onFileChange={handleFileChange}
          onSend={handleSend}
          onFileTypeChange={handleFileTypeChange}
        />
      )}
    </div>
  );
};
