import { useState } from "react";
import styles from "../styles/chat.module.css";
import { roomData } from "../interfaces/interfaces";
import UserImage from "./userImage";
import ChatSettingBox from "./chatSettingBox";
import { Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const ChatHeader = ({
  data,
  userStatus,
}: {
  data: roomData | undefined;
  userStatus: { userId: string; status: string; lastSeen: Date | undefined };
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const chatStatus =
    data && data.roomType === "chat"
      ? `last seen on ${userStatus.lastSeen}`
      : data?.roomType === "group"
      ? `${data.numberOfMembers} members`
      : `${data?.numberOfMembers} subscribers`;

  const handleOpenSettings = () => setIsSettingsOpen(true);
  const handleCloseSettings = () => setIsSettingsOpen(false);

  return (
    <>
      <div className={styles.chatHeaderBox} onClick={handleOpenSettings}>
        <div className={styles.chatNameBox}>
          <UserImage className={styles.image} src={data && data.imgURL} />
          <div className={styles.chatNameInfoBox}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ color: "var(--color-text-default)" }}
            >
              {data && data.roomName}
            </Typography>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ color: "var(--color-text-default)" }}
            >
              {chatStatus}
            </Typography>
          </div>
        </div>
        <div style={{ alignSelf: "center" }}>
          <button className={styles.resetDefaultButton}>
            <SearchIcon
              sx={{
                margin: "auto 0",
                borderRadius: "100%",
                color: "var(--color-text-default)",
                width: "32px",
                height: "32px",
              }}
            />
          </button>
        </div>
      </div>

      {isSettingsOpen && (
        <ChatSettingBox
          isOpen={isSettingsOpen}
          onClose={handleCloseSettings}
          chatData={data}
        />
      )}
    </>
  );
};
