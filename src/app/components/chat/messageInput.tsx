"use client";
import styles from "../../styles/messageInput.module.css";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import { IconButton, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useEffect, useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { message } from "../../interfaces/interfaces";
import SelectFiles from "./selectFiles";
import Picker from "@emoji-mart/react";
// import data from "@emoji-mart/data/sets/15/apple.json";
import data from "@emoji-mart/data";
import { Close as CloseIcon, EditNote, Reply } from "@mui/icons-material";
import { useSendMessage } from "../../services/sendMessage";
import { useChatFormContext } from "@/app/contexts/chatFormContext";
import { useFilesContext } from "@/app/contexts/filesContext";
import { useDarkModeContext } from "@/app/contexts/darkModeContext";

const ariaLabel = { "aria-label": "Type message box" };

export const MessageInput = ({
  roomId,
  messages,
}: {
  roomId: string;
  messages: message[];
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleSendMessage = useSendMessage();
  const {
    messageText,
    isMessageEdit,
    targetMessageId,
    isMessageReply,
    handleSetText,
    handleEmojiSelect,
    handleSetIsMessageReplyFalse,
  } = useChatFormContext();

  const { files, showFileWindow, handleFileChange } = useFilesContext();
  const [isDarkMode] = useDarkModeContext();

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const pickerContainer = document.querySelector(
        `.${styles.emojiPickerContainer}`
      );
      if (pickerContainer && !pickerContainer.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleVoiceRecord = () => {
    // Add logic for starting voice recording
  };

  return (
    <div
      className={styles.messageInputBox}
      style={{
        bottom: isMessageReply ? "-118px" : "-68px",
      }}
    >
      <div className={styles.leftBox}>
        {(isMessageReply || isMessageEdit) && targetMessageId && (
          <div className={styles.replyBox}>
            {isMessageReply ? (
              <Reply sx={{ fontSize: 40 }} />
            ) : (
              <EditNote sx={{ fontSize: 40 }} />
            )}
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
                onClick={handleSetIsMessageReplyFalse}
              />
            </div>
          </div>
        )}
        <div className={styles.inputBox}>
          <div>
            <IconButton
              onClick={toggleEmojiPicker}
              sx={{ color: "var(--color-text-default)" }}
            >
              <EmojiEmotionsIcon sx={{ fontSize: "28px" }} />
            </IconButton>
            {showEmojiPicker && (
              <div className={styles.emojiPickerContainer}>
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme={isDarkMode ? "dark" : "light"}
                  previewPosition="none"
                  // set="apple"
                  perLine={8}
                  emojiSize={24}
                  emojiButtonColors={[
                    "rgba(155,223,88,.7)",
                    "rgba(149,211,254,.7)",
                    "rgba(247,197,159,.7)",
                    "rgba(238,166,252,.7)",
                    "rgba(255,213,143,.7)",
                    "rgba(184,233,134,.7)",
                  ]}
                  emojiButtonRadius="6px"
                />
              </div>
            )}
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
                  border: "none",
                  outline: "none",
                  width: "100%",
                  minHeight: "24px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                  padding: "8px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  webkitTextFillColor: "var(--color-text-default)",
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
            onClick={() => handleSendMessage(roomId)}
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
      {showFileWindow && <SelectFiles roomId={roomId} />}
    </div>
  );
};
