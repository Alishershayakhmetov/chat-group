"use client";
import styles from "../../styles/message.module.css";
import { message } from "../../interfaces/interfaces";
import { extractTime } from "../../utils/formatDate";
import UserImage from "../common/userImage";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { EditNote, Delete, Reply, Forward } from "@mui/icons-material";
import { useSocketContext } from "../../contexts/socketContext";
import ForwardList from "./forwardList";
import { DownloadMedia } from "./downloadMedia";
import { RenderMedia } from "./renderMedia";
import { getForwardedImg, getForwardedName } from "@/app/utils/forwardedData";
import { useChatFormContext } from "@/app/contexts/chatFormContext";

export const Message = ({
  data,
  userId,
}: {
  data: message;
  userId: string | null;
}) => {
  const { socket } = useSocketContext();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);

  const { handleEditMessage, handleReplyMessage } = useChatFormContext();

  // Close menu on click outside or scroll
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    const handleScroll = () => setShowMenu(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle right-click (desktop)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default right-click menu
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(!showMenu);
  };

  // Handle long press (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.cancelable) e.preventDefault(); // Prevent native touch context menu

    holdTimer.current = setTimeout(() => {
      const touch = e.touches[0];
      setMenuPosition({ x: touch.clientX, y: touch.clientY });
      setShowMenu(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
    }
  };

  const handleDeleteMessage = () => {
    socket.emit("deleteMessage", { messageId: data.id });
  };

  return (
    <div
      className={styles.messageBox}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.profileImageBox}>
        <UserImage
          src={data.imgURL}
          alt="profile image"
          width={32}
          height={32}
          style={{
            borderRadius: "50%",
          }}
        />
      </div>
      <div className={styles.rightBox}>
        <div className={styles.contentBox}>
          <div className={`${styles.relative} ${styles.messageHeader}`}>
            <span>{data.userName}</span>
            <span className={styles.time}>
              {data.isEdited && "edited"} {extractTime(data.createdAt)}
            </span>
          </div>

          {/* Original Message (quoted/replied) */}
          {data.originalMessageId && data.originalMsg && (
            <div className={styles.quotedMessage}>
              <Typography variant="caption" className={styles.quoteLabel}>
                Replying to {data.originalMsg.user.name}
              </Typography>
              <div className={styles.quoteContent}>
                <Typography variant="body2" className={styles.quoteText}>
                  {data.originalMsg.text}
                </Typography>
              </div>
            </div>
          )}

          {/* Forwarded Message */}
          {data.forwardedMessageId && data.forwardedMsg && (
            <div className={styles.forwardedMessage}>
              <div className={styles.forwardHeader}>
                <Forward fontSize="small" className={styles.forwardIcon} />
                <Typography variant="caption" className={styles.forwardLabel}>
                  Forwarded from{" "}
                  <img
                    src={getForwardedImg(data.forwardedMsg)}
                    width={12}
                    height={12}
                  />{" "}
                  {getForwardedName(data.forwardedMsg)}
                </Typography>
              </div>
            </div>
          )}

          <RenderMedia attachments={data.attachments} />

          <Typography variant="body2" gutterBottom>
            {data.text}
          </Typography>

          <DownloadMedia attachments={data.attachments} />
        </div>
      </div>
      {showMenu && (
        <Menu
          open={showMenu}
          anchorReference="anchorPosition"
          anchorPosition={{
            top: menuPosition.y,
            left: menuPosition.x,
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem onClick={handleDeleteMessage}>
            {userId === data.userId && (
              <>
                <ListItemIcon>
                  <Delete fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </>
            )}
          </MenuItem>
          <MenuItem onClick={() => handleReplyMessage({ messageId: data.id! })}>
            <ListItemIcon>
              <Reply fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reply</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setIsForwardModalOpen(true)}>
            <ListItemIcon>
              <Forward fontSize="small" />
            </ListItemIcon>
            <ListItemText>Forward</ListItemText>
          </MenuItem>
          {userId === data.userId && (
            <>
              <MenuItem
                onClick={() =>
                  handleEditMessage({
                    messageId: data.id!,
                    messageText: data.text,
                  })
                }
              >
                <ListItemIcon>
                  <EditNote fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
            </>
          )}
        </Menu>
      )}

      {isForwardModalOpen && (
        <ForwardList
          isOpen={isForwardModalOpen}
          onClose={() => setIsForwardModalOpen(false)}
          message={data}
        />
      )}
    </div>
  );
};
