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
            <Image src={Dots} width={24} height={24} alt="settings" />
            <CloseIcon
              sx={{ fontSize: 30, color: "black" }}
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
            <Typography variant="body2" color="textSecondary">
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
