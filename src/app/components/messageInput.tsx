"use client";
import styles from "../styles/messageInput.module.css";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import { IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useState } from "react";
import MicIcon from "@mui/icons-material/Mic"; // Mic icon for voice
import SendIcon from "@mui/icons-material/Send"; // Send icon

interface FileAttachmentProps {
  onFileSelect: (file: File) => void;
}

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
}

const ariaLabel = { "aria-label": "Type message box" };

export const MessageInput = () => {
  const [message, setMessage] = useState("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file); // Pass the selected file to the parent component
    }
  };

  const handleEmojiClick = () => {
    // Placeholder for actual emoji picker or you can open an emoji picker library
    const emoji = "😊"; // Example emoji
    setMessage(message + emoji); // Send the emoji to parent component
  };

  const handleSend = () => {
    console.log("Message sent:", message);
    setMessage(""); // Clear message after sending
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
        {message ? (
          <IconButton
            onClick={handleSend}
            disabled={!message}
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
    </div>
  );
};
