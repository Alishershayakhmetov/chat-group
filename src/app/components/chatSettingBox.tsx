import {
  Modal,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Checkbox,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../styles/chatSettingBox.module.css";
import { useSocketContext } from "../contexts/socketContext";
import { roomData } from "../interfaces/interfaces";

export default function ChatSettingBox({
  isOpen,
  onClose,
  chatData,
}: {
  isOpen: boolean;
  onClose: () => void;
  chatData: roomData | undefined;
}) {
  const [showMedia, setShowMedia] = useState(false);
  const [isAddingNewToGroupOpen, setIsAddingNewToGroupOpen] = useState(false);

  const handleMediaToggle = () => setShowMedia((prev) => !prev);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={styles.modalBox}>
        <Box className={styles.header}>
          <Typography variant="h6">
            {chatData?.roomName || "Chat Info"}
          </Typography>
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
              src={chatData?.imgURL || "/user-solid.svg"}
              width={80}
              height={80}
              alt="Profile"
            />
          </Box>
          <Box>
            <Typography variant="subtitle1">
              {chatData?.roomName || "User/Group Name"}
            </Typography>
            <Typography variant="body2" color="var(--color-text-default)">
              {/*chatData.lastActiveTime ||*/ "Online"}
            </Typography>
          </Box>
        </Box>

        <Box className={styles.details}>
          <Typography variant="body1">
            {/*chatData.bio || */ "No bio available."}
          </Typography>
          <Typography variant="caption">
            {/*chatData.tag || */ "No tag assigned."}
          </Typography>
        </Box>

        <Box className={styles.mediaSection}>
          <Button variant="outlined" onClick={handleMediaToggle}>
            {showMedia ? "Hide Media" : "Show Media"}
          </Button>
          {showMedia && (
            <Box className={styles.mediaContent}>
              {
                /*chatData.media?.length ? (
                chatData.media.map((media: any, index: number) => (
                  <Image
                    key={index}
                    src={media.src}
                    width={50}
                    height={50}
                    alt={media.alt || "media"}
                  />
                ))
              ) : */ <Typography variant="body2" color="textSecondary">
                  No media found.
                </Typography>
              }
            </Box>
          )}
        </Box>

        <Box className={styles.actionsSection}>
          {chatData?.roomType === "group" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsAddingNewToGroupOpen(true)}
            >
              Add to group
            </Button>
          )}

          <Button variant="contained" color="warning">
            Delete Contact
          </Button>
          <Button variant="contained" color="error">
            Block User
          </Button>
        </Box>
        {isAddingNewToGroupOpen && (
          <AddingList
            isOpen={isAddingNewToGroupOpen}
            onClose={() => setIsAddingNewToGroupOpen(false)}
            chatData={chatData}
          />
        )}
      </Box>
    </Modal>
  );
}

const AddingList = ({
  isOpen,
  onClose,
  chatData,
}: {
  isOpen: boolean;
  onClose: () => void;
  chatData: roomData | undefined;
}) => {
  interface Room {
    id: string;
    chatName: string | null;
    chatImageURL: string | null;
  }

  const socket = useSocketContext();
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  useEffect(() => {
    const handleGetRooms = (data: Room[]) => {
      setRooms(data);
    };

    socket.emit("getOnlyUserRooms", { groupId: chatData?.id });
    socket.on("getOnlyUserRooms", handleGetRooms);

    return () => {
      socket.off("getOnlyUserRooms", handleGetRooms);
    };
  }, [socket]);

  // Toggle room selection
  const handleToggleRoom = (roomId: string) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  // Emit forward event
  const handleAddUserToGroup = () => {
    if (selectedRooms.length === 0 || chatData === undefined) return;

    socket.emit("addUserInGroup", {
      userIds: selectedRooms,
      groupId: chatData.id,
    });

    setSelectedRooms([]);
    onClose();
  };

  const filteredRooms = rooms.filter((room) =>
    room.chatName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Forward Message</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Search rooms..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            margin="dense"
          />
        </Box>

        <List>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <ListItem key={room.id} disablePadding>
                <ListItemButton onClick={() => handleToggleRoom(room.id)}>
                  <Checkbox
                    edge="start"
                    checked={selectedRooms.includes(room.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={room.chatName} />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No rooms found" />
            </ListItem>
          )}
        </List>

        {/* Forward Button */}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            disabled={selectedRooms.length === 0}
            onClick={handleAddUserToGroup}
          >
            Forward ({selectedRooms.length})
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
