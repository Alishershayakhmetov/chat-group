import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Button,
  Box,
  Checkbox,
} from "@mui/material";
import { useSocketContext } from "../../contexts/socketContext";
import { message } from "../../interfaces/interfaces";
import UserImage from "../common/userImage";

interface Room {
  id: string;
  chatName: string | null;
  chatImageURL: string | null;
}

interface ForwardListProps {
  isOpen: boolean;
  onClose: () => void;
  message: message;
}

export default function ForwardList({
  isOpen,
  onClose,
  message,
}: ForwardListProps) {
  const { socket } = useSocketContext();
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  useEffect(() => {
    const handleGetRooms = (data: Room[]) => {
      setRooms(data);
    };

    socket.emit("getRooms");
    socket.on("getRooms", handleGetRooms);

    return () => {
      socket.off("getRooms", handleGetRooms);
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
  const handleForwardMessage = () => {
    if (selectedRooms.length === 0) return;

    socket.emit("forwardMessages", { roomIds: selectedRooms, message });

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
                  <UserImage
                    src={room.chatImageURL}
                    alt="User image"
                    width={50}
                    height={50}
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
            onClick={handleForwardMessage}
          >
            Forward ({selectedRooms.length})
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
