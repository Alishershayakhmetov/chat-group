"use client";
import Image from "next/image";
import styles from "../styles/message.module.css";
import { attachment, message } from "../interfaces/interfaces";
import { extractTime } from "../utils/formatDate";
import UserImage from "./userImage";
import {
  Card,
  CardContent,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { formatFileSize } from "../utils/formatFileSize";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useEffect, useRef, useState } from "react";
import { EditNote, Delete, Reply, Forward } from "@mui/icons-material";
import { useSocketContext } from "../contexts/socketContext";
import ForwardList from "./forwardList";

export const Message = ({
  data,
  handleEditMessage,
  handleReplyMessage,
}: {
  data: message;
  handleEditMessage: ({
    messageId,
    messageText,
  }: {
    messageId: string;
    messageText: string;
  }) => void;
  handleReplyMessage: ({ messageId }: { messageId: string }) => void;
}) => {
  const socket = useSocketContext();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);

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
    setShowMenu(true);
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
        />
      </div>
      <div className={styles.rightBox}>
        {data.originalMessageId && data.originalMsg && (
          <div>
            <Typography>{data.originalMsg.user.name}</Typography>
            <Typography>{data.originalMsg.text}</Typography>
          </div>
        )}
        <div className={styles.contentBox}>
          <div className={`${styles.relative} ${styles.messageHeader}`}>
            <span>{data.userName}</span>
            <span className={styles.time}>
              {data.isEdited && "edited"} {extractTime(data.updatedAt)}
            </span>
          </div>

          {/* Render Media */}
          <RenderMedia attachments={data.attachments} />

          {/* <pre>{data.text}</pre> */}

          <Typography variant="body2" gutterBottom>
            {data.text}
          </Typography>

          {/* Download Media */}
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
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
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
          <MenuItem
            onClick={() =>
              handleEditMessage({ messageId: data.id!, messageText: data.text })
            }
          >
            <ListItemIcon>
              <EditNote fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
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

const RenderMedia = ({ attachments }: { attachments: attachment[] }) => {
  return (
    <div className={styles.mediaContainer}>
      {attachments &&
        attachments
          .filter((attachment) => !attachment.saveAsMedia)
          .map((attachment, index) => (
            <div key={index} className={styles.mediaItem}>
              <MediaComponent
                url={attachment.fileURL}
                name={attachment.fileName}
                fileBase64Blur={attachment.fileBase64Blur}
              />
            </div>
          ))}
    </div>
  );
};

const DownloadMedia = ({ attachments }: { attachments: attachment[] }) => {
  return (
    <div className={styles.downloadContainer}>
      {attachments &&
        attachments
          .filter((attachment) => attachment.saveAsMedia)
          .map((attachment) => (
            <Card
              key={attachment.fileURL}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                cursor: "pointer",
                backgroundColor: "var(--bg-color-text-default)",
              }}
              onClick={() => downloadMedia(attachment.fileURL!)}
            >
              <InsertDriveFileIcon
                sx={{
                  fontSize: 34,
                  color: "var(--color-text-default)",
                }}
              />
              <CardContent
                sx={{ flex: 1, padding: "0", paddingBottom: "0 !important" }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: "var(--color-text-default)" }}
                >
                  {attachment.fileName}
                </Typography>
                <Typography variant="body2" color="var(--color-text-default)">
                  {formatFileSize(attachment.fileSize)}
                </Typography>
              </CardContent>
            </Card>
          ))}
    </div>
  );
};

const MediaComponent = ({
  url,
  name,
  fileBase64Blur,
}: {
  url: string;
  name: string;
  fileBase64Blur: string | undefined;
}) => {
  // Render the appropriate media type (image, video, etc.)
  if (name.endsWith(".mp4")) {
    return <video controls src={url} className={styles.video} />;
  } else if (name.endsWith(".jpg") || name.endsWith(".png")) {
    return (
      <Image
        src={url}
        alt="Media"
        width={200}
        height={200}
        placeholder={fileBase64Blur ? "blur" : "empty"}
        blurDataURL={fileBase64Blur}
      />
    );
  }
  return <a href={url}>View Media</a>;
};

const downloadMedia = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
