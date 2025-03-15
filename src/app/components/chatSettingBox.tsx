import { Modal, Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import Dots from "../../../public/dots-vertical-2.svg";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../styles/chatSettingBox.module.css";
export default function ChatSettingBox({ isOpen, onClose, chatData }: any) {
  const [showMedia, setShowMedia] = useState(false);

  const handleMediaToggle = () => setShowMedia((prev) => !prev);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={styles.modalBox}>
        <Box className={styles.header}>
          <Typography variant="h6">{chatData.title || "Chat Info"}</Typography>
          <Box className={styles.actions}>
            <svg
              className="svg-icon"
              style={{
                width: "1.5em",
                height: "1.5em",
                verticalAlign: "middle",
                fill: "var(--color-text-default)",
                overflow: "hidden",
              }}
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M512 512m-116.949333 0a116.949333 116.949333 0 1 0 233.898666 0 116.949333 116.949333 0 1 0-233.898666 0Z" />
              <path d="M512 159.616m-116.949333 0a116.949333 116.949333 0 1 0 233.898666 0 116.949333 116.949333 0 1 0-233.898666 0Z" />
              <path d="M512 864.384m-116.949333 0a116.949333 116.949333 0 1 0 233.898666 0 116.949333 116.949333 0 1 0-233.898666 0Z" />
            </svg>
            <CloseIcon
              sx={{ fontSize: 30, color: "var(--color-text-default)" }}
              onClick={onClose}
            />
          </Box>
        </Box>

        <Box className={styles.profileSection}>
          <Box className={styles.profileImage}>
            <Image
              src={chatData.profileImage || "/placeholder.png"}
              width={80}
              height={80}
              alt="Profile"
            />
          </Box>
          <Box>
            <Typography variant="subtitle1">
              {chatData.name || "User/Group Name"}
            </Typography>
            <Typography variant="body2" color="var(--color-text-default)">
              {chatData.status || "Online"}
            </Typography>
          </Box>
        </Box>

        <Box className={styles.details}>
          <Typography variant="body1">
            {chatData.bio || "No bio available."}
          </Typography>
          <Typography variant="caption">
            {chatData.tag || "No tag assigned."}
          </Typography>
        </Box>

        <Box className={styles.mediaSection}>
          <Button variant="outlined" onClick={handleMediaToggle}>
            {showMedia ? "Hide Media" : "Show Media"}
          </Button>
          {showMedia && (
            <Box className={styles.mediaContent}>
              {chatData.media?.length ? (
                chatData.media.map((media: any, index: number) => (
                  <Image
                    key={index}
                    src={media.src}
                    width={50}
                    height={50}
                    alt={media.alt || "media"}
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No media found.
                </Typography>
              )}
            </Box>
          )}
        </Box>

        <Box className={styles.actionsSection}>
          <Button variant="contained" color="primary">
            Share Contact
          </Button>
          <Button variant="contained" color="warning">
            Delete Contact
          </Button>
          <Button variant="contained" color="error">
            Block User
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
