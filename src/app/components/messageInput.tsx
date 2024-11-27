"use client";
import styles from "../styles/messageInput.module.css";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import { IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useEffect, useState } from "react";
import MicIcon from "@mui/icons-material/Mic"; // Mic icon for voice
import SendIcon from "@mui/icons-material/Send"; // Send icon
import { useSocketContext } from "../contexts/socketContext";

interface FileAttachmentProps {
  onFileSelect: (file: File) => void;
}

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
}

const ariaLabel = { "aria-label": "Type message box" };

export const MessageInput = ({ roomId }: { roomId: string }) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const socket = useSocketContext();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      if (files.length + fileArray.length > 10) {
        alert("You can only attach up to 10 files."); // ADD NEW MESSAGE
        return;
      }
      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
    }
  };

  // Remove a specific file
  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleEmojiClick = () => {
    // Placeholder for actual emoji picker or you can open an emoji picker library
    const emoji = "😊"; // Example emoji
    setMessage(message + emoji); // Send the emoji to parent component
  };

  const handleSend = () => {
    if (!message.trim() && files.length === 0) {
      alert("Cannot send an empty message.");
      return;
    }

    // Construct payload
    const payload = {
      roomId,
      text: message.trim(),
      attachments: files, // This will be an array of File objects
    };

    socket.emit("sendMessage", payload);
    console.log("Message sent:", payload);

    // Clear message and files
    setMessage("");
    setFiles([]);
  };

  const handleVoiceRecord = () => {
    console.log("Start recording voice message...");
    // Add logic for starting voice recording
  };

  return (
    <div className={styles.messageInputBox}>
      <div className={styles.leftBox}>
        <div>
          {/* emoji selection container */}
          <IconButton onClick={handleEmojiClick}>
            <EmojiEmotionsIcon />
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Box>
        </div>
        <div>
          <input
            type="file"
            id="file-upload"
            multiple
            style={{ display: "none" }} // Hide the default file input
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <IconButton component="span">
              <AttachFileIcon />
            </IconButton>
          </label>
        </div>
      </div>
      <div className={styles.rightBox}>
        {/* Voice message or Send button */}
        {message || files.length ? (
          <IconButton
            onClick={handleSend}
            disabled={!message && files.length == 0}
            className={styles.fade}
          >
            <SendIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleVoiceRecord} className={styles.fade}>
            <MicIcon />
          </IconButton>
        )}
      </div>
      {/* Display attached files */}
      {files.length > 0 && (
        <div className={styles.attachedFiles}>
          {files.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <span>{file.name}</span>
              <IconButton size="small" onClick={() => handleRemoveFile(file)}>
                ❌
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
