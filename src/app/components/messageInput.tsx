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
import axios from "axios";
import { message } from "../interfaces/interfaces";
import { v4 as uuid } from "uuid";
import SelectFiles from "./selectFiles";

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
    }[];
  }) => string;
}) => {
  console.log(`roomId roomId roomId ${roomId}`);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<{ file: File; saveAsMedia: boolean }[]>(
    []
  );
  const [showFileWindow, setShowFileWindow] = useState(false);
  const socket = useSocketContext();

  const handleSetText = (text: string) => {
    setMessage(text);
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
    setMessage(message + emoji); // Send the emoji to parent component
  };

  /*
  const handleSend = async () => {
    if (!message.trim() && files.length === 0) {
      alert("Cannot send an empty message.");
      return;
    }

    const processedFiles = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                content: reader.result, // Base64 encoded file content
              });
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
          })
      )
    );

    // Construct payload
    const payload = {
      roomId,
      text: message.trim(),
      attachments: processedFiles, // This will be an array of File objects
    };

    socket.emit("sendMessage", payload);
    console.log("Message sent:", payload);

    // Clear message and files
    setMessage("");
    setFiles([]);
  };
  */

  /*
  const handleSend = async () => {
    files.map((file) => file.file.name.split(".").pop());
    const result = await axios.post("http://localhost:3005/upload", {
      extensions: files.map((file) => file.file.name.split(".").pop()),
    });
    const urls = result.data.urls;
    console.log(urls);
    urls.map((url: string, index: number) => {
      const put = axios.put(url, files[index]);
      const fileUrl = url.split("?")[0];
      console.log(fileUrl);
    });
    // when all files are loaded, create new records about files in db
  };
  */
  /*
  const handleSend = async () => {
    try {
      // Extract file extensions
      const extensions = files.map((file) => {
        const parts = file.file.name.split(".");
        return parts.length > 1 ? parts.pop() : ""; // Handle files without extensions
      });

      // Get signed upload URLs
      const result = await axios.post("http://localhost:3005/upload", {
        extensions,
      });

      const urls: { url: string; key: string }[] = result.data.urls;
      const urlsWithMetadata = urls.map((url, index) => ({
        url: url.url,
        key: url.key,
        name: files[index].file.name,
        isNamePersist: files[index].isNamePersist,
      }));

      // Upload files to the provided URLs
      const uploadPromises = urlsWithMetadata.map((url, index: number) => {
        const fileUrl = url.url.split("?")[0];
        console.log(`Uploading file to: ${fileUrl}`);
        return axios
          .put(url.url, files[index])
          .then(() => ({ ...url, url: fileUrl })); // Resolve with the file URL
      });

      // Wait for all uploads to complete
      const uploadedFileUrls = await Promise.all(uploadPromises);
      console.log("All files uploaded successfully:", uploadedFileUrls);

      // Create new records in the database after all uploads complete
      await axios.post("http://localhost:3005/createRecords", {
        filesData: uploadedFileUrls,
        messageId: //message ID
      });

      console.log("Database records created successfully");
    } catch (error) {
      console.error("Error during file upload process:", error);
    }
  };
  */

  const handleSend = async () => {
    if (!message.trim() && files.length === 0) {
      alert("Cannot send an empty message.");
      return;
    }

    const text = message.trim();
    const attachments = files.map((file) => ({
      fileName: file.file.name,
      saveAsMedia: file.saveAsMedia,
      fileURL: URL.createObjectURL(file.file),
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
        console.log(`Uploading file to: ${fileUrl}`);
        return axios.put(fileUrl, file.file, {
          headers: {
            "Content-Type": file.file.type,
          },
        });
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      console.log("All files uploaded successfully.");

      // Prepare the list of uploaded file URLs and metadata
      const uploadedFiles = urls.map(
        (url: { url: string; key: string }, index: number) => ({
          key: url.key,
          name: files[index].file.name,
          url: url.url.split("?")[0], // Remove query parameters from URL
          saveAsMedia: files[index].saveAsMedia,
        })
      );

      // Emit message event with text and attachments
      const payload = {
        roomId,
        text: message.trim(),
        attachments: uploadedFiles,
        tempId,
      };

      socket.emit("sendMessage", payload);
      console.log("Message sent:", payload);

      // Clear input fields and file attachments
      setMessage("");
      setFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
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
              onChange={(e) => handleSetText(e.target.value)}
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
      {showFileWindow && (
        <SelectFiles
          files={files}
          text={message}
          onDeleteFile={handleRemoveFile}
          onClose={handleCloseWindow}
          onTextChange={handleSetText}
          onFileChange={handleFileChange}
          onSend={handleSend}
          onFileTypeChange={handleFileTypeChange}
        />
      )}

      {/* files.length > 0 && (
        <div className={styles.attachedFiles}>
          {files.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <span>{file.file.name}</span>
              <IconButton size="small" onClick={() => handleRemoveFile(index)}>
                ❌
              </IconButton>
            </div>
          ))}
        </div>
          ) */}
    </div>
  );
};
