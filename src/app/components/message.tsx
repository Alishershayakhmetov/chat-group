"use client";
import Image from "next/image";
import styles from "../styles/message.module.css";
import { attachment, message } from "../interfaces/interfaces";
import { extractTime } from "../utils/formatDate";
import UserImage from "./userImage";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Grid2,
  ImageList,
  ImageListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  styled,
} from "@mui/material";
import { formatFileSize } from "../utils/formatFileSize";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditNote, Delete, Reply, Forward } from "@mui/icons-material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { useSocketContext } from "../contexts/socketContext";
import ForwardList from "./forwardList";
import PhotoViewer from "./viewer";
import axios from "axios";

export const Message = ({
  data,
  handleEditMessage,
  handleReplyMessage,
  userId,
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
  userId: string | null;
}) => {
  const { socket } = useSocketContext();
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

const downloadMedia = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const StyledImageList = styled(ImageList)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  margin: 0,
  "& .MuiImageListItem-root": {
    display: "flex",
  },
}));

const MediaContainer = styled("div")({
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
});

const MediaContent = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const VideoIndicator = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: "white",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  borderRadius: "50%",
  padding: theme.spacing(1),
  zIndex: 1,
}));

const RenderMedia = ({ attachments }: { attachments: attachment[] }) => {
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);

  const handleImageClick = useCallback(
    (clickedUrl: string) => {
      const clickedIndex = attachments.findIndex(
        (img) => img.fileURL === clickedUrl
      );
      if (clickedIndex !== -1) {
        setPhotoViewerIndex(clickedIndex);
        setPhotoViewerOpen(true);
      }
    },
    [attachments]
  );
  if (attachments === undefined || !attachments.length) return null;

  const getLayoutConfig = (count: number) => {
    switch (count) {
      case 1:
        return { cols: 1, cellHeight: 400, rowHeight: 400 };
      case 2:
        return { cols: 2, cellHeight: 200, rowHeight: 250 };
      case 3:
        return {
          cols: 3,
          cellHeight: "auto",
          rowHeight: 180,
          layout: "1fr 1fr 1fr",
        };
      case 4:
        return {
          cols: 2,
          cellHeight: "auto",
          rowHeight: 180,
          layout: "1fr 1fr",
        };
      case 5:
        // Special layout: 1 large on left, 4 small stacked on right
        return {
          cols: 6, // Using 6 columns for more precise control
          rowHeight: [240, 120, 120],
          layout: "3fr 1fr 1fr 1fr", // 3/6 for first column, 1/6 for others
          structure: [
            {
              colSpan: 3,
              rowSpan: 2,
              gridColumn: "1 / span 3",
              gridRow: "1 / span 2",
            }, // Big left item
            {
              colSpan: 3,
              rowSpan: 1,
              gridColumn: "4 / span 3",
              gridRow: "1 / span 1",
            }, // Top right
            {
              colSpan: 3,
              rowSpan: 1,
              gridColumn: "4 / span 3",
              gridRow: "2 / span 1",
            }, // Bottom right
            {
              colSpan: 3,
              rowSpan: 1,
              gridColumn: "4 / span 3",
              gridRow: "3 / span 1",
            }, // Extra if needed
            {
              colSpan: 3,
              rowSpan: 1,
              gridColumn: "4 / span 3",
              gridRow: "4 / span 1",
            }, // Extra if needed
          ],
        };
      case 6:
        return {
          cols: 3,
          cellHeight: "auto",
          rowHeight: 150,
          layout: "1fr 1fr 1fr",
        };
      case 7:
        // New fixed 2-2-3 layout
        return {
          cols: 3,
          rowHeight: [150, 150, 100],
          layout: "1fr 1fr 1fr",
          structure: [
            // Row 1
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "1 / span 1",
              gridRow: "1 / span 1",
            }, // Row 1 - Item 1
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "2 / span 1",
              gridRow: "1 / span 1",
            }, // Row 1 - Item 2

            // Row 2
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "1 / span 1",
              gridRow: "2 / span 1",
            }, // Row 2 - Item 1
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "2 / span 1",
              gridRow: "2 / span 1",
            }, // Row 2 - Item 2

            // Row 3
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "1 / span 1",
              gridRow: "3 / span 1",
            }, // Row 3 - Item 1
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "2 / span 1",
              gridRow: "3 / span 1",
            }, // Row 3 - Item 2
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "3 / span 1",
              gridRow: "3 / span 1",
            }, // Row 3 - Item 3
          ],
        };
      case 8:
        return {
          cols: 4,
          cellHeight: "auto",
          rowHeight: 180,
          layout: "1fr 1fr 1fr 1fr",
        };
      case 9:
        return {
          cols: 3,
          cellHeight: "auto",
          rowHeight: 180,
          layout: "1fr 1fr 1fr",
        };
      case 10:
        // Special layout: first 2 items bigger
        return {
          cols: 4,
          rowHeight: [160, 160, 100, 100], // First two rows taller
          layout: "1fr 1fr 1fr 1fr",
          structure: [
            { colSpan: 2, rowSpan: 2 }, // Big item 1
            { colSpan: 2, rowSpan: 2 }, // Big item 2
            { colSpan: 1, rowSpan: 1 }, // Smaller items
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
          ],
        };
      default:
        return {
          cols: 3,
          cellHeight: "auto",
          rowHeight: 120,
          layout: "1fr 1fr 1fr",
        };
    }
  };

  const { cols, rowHeight, layout, structure } = getLayoutConfig(
    attachments.length
  );

  const renderMediaItem = (item: attachment, index: number) => {
    const isVideo = item.fileName.endsWith(".mp4");
    const config = structure?.[index] || { colSpan: 1, rowSpan: 1 };

    return (
      <ImageListItem
        key={item.fileURL || index}
        cols={config.colSpan}
        rows={config.rowSpan}
        sx={{
          "&:hover": {
            zIndex: 2,
          },
        }}
      >
        <MediaContainer>
          <MediaContent
            src={item.fileURL}
            alt=""
            loading="lazy"
            style={{
              aspectRatio: "1/1",
            }}
            onClick={() => {
              setPhotoViewerIndex(index);
              setPhotoViewerOpen(true);
            }}
          />
          {isVideo && (
            <VideoIndicator>
              <PlayCircleOutlineIcon fontSize="large" />
            </VideoIndicator>
          )}
        </MediaContainer>
      </ImageListItem>
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600 }}>
      <StyledImageList
        cols={cols}
        rowHeight={Array.isArray(rowHeight) ? rowHeight[0] : rowHeight}
        gap={8}
        sx={{
          gridTemplateColumns: layout,
          gridAutoRows: Array.isArray(rowHeight) ? "min-content" : rowHeight,
          "& .MuiImageListItem-root": {
            overflow: "hidden",
            borderRadius: 1,
          },
        }}
      >
        {attachments.map((item, index) => renderMediaItem(item, index))}
      </StyledImageList>
      {attachments && attachments.length > 0 && (
        <PhotoViewer
          open={photoViewerOpen}
          onClose={() => {
            setPhotoViewerOpen(false);
            setPhotoViewerIndex(0);
          }}
          currentIndex={photoViewerIndex}
          images={attachments.map((attachment) => ({
            url: attachment.fileURL,
            caption: attachment.fileName,
          }))}
        />
      )}
    </Box>
  );
};

const MediaComponent = ({
  url,
  name,
  fileBase64Blur,
  onClick,
}: {
  url: string;
  name: string;
  fileBase64Blur?: string;
  onClick: (url: string) => void;
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlob = async () => {
      try {
        const response = await axios.get(url, { responseType: "blob" });
        const localUrl = URL.createObjectURL(response.data);
        setBlobUrl(localUrl);
      } catch (error) {
        console.error("Error loading media:", error);
      }
    };

    fetchBlob();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [url]);

  if (name.endsWith(".mp4")) {
    return <video controls src={blobUrl || url} className={styles.video} />;
  } else if (
    name.endsWith(".jpg") ||
    name.endsWith(".png") ||
    name.endsWith(".gif")
  ) {
    return (
      <Image
        src={blobUrl || url}
        alt="Media"
        width={200}
        height={200}
        placeholder={fileBase64Blur ? "blur" : "empty"}
        blurDataURL={fileBase64Blur}
        onClick={() => onClick(url)}
        style={{ cursor: "pointer" }}
      />
    );
  }

  return <a href={blobUrl || url}>View Media</a>;
};

// Helper function to determine forwarded from source
function getForwardedName(forwardedMsg: any) {
  if (forwardedMsg.channel) return forwardedMsg.channel.name;
  if (forwardedMsg.group) return forwardedMsg.group.name;
  if (forwardedMsg.user) return forwardedMsg.user.name;
  return "Unknown";
}

function getForwardedImg(forwardedMsg: any) {
  if (forwardedMsg.channel) return forwardedMsg.channel.imgURL;
  if (forwardedMsg.group) return forwardedMsg.group.imgURL;
  if (forwardedMsg.user) return forwardedMsg.user.imgURL;
  return "Unknown";
}
