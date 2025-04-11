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
import styles from "../../styles/chatSettingBox.module.css";
import { useSocketContext } from "../../contexts/socketContext";
import { roomData } from "../../interfaces/interfaces";
import UserImage from "../common/userImage";

interface User {
  id: string;
  name: string | null;
  lastName: string | null;
  imgURL: string | null;
}

export default function ChatSettingBox({
  isOpen,
  onClose,
  chatData,
}: {
  isOpen: boolean;
  onClose: () => void;
  chatData: roomData | undefined;
}) {
  enum PopUpWindow {
    AddNewUsersToGroup = "AddNewUsersToGroup",
    DeleteMemberFromGroup = "DeleteMemberFromGroup",
    LeaveGroup = "LeaveGroup",
    UnsubscribeFromChannel = "UnsubscribeFromChannel",
    Empty = "",
  }
  const [showMedia, setShowMedia] = useState(false);
  // const [isAddingNewToGroupOpen, setIsAddingNewToGroupOpen] = useState(false);
  // const [isDeletingMembersOpen, setIsDeletingMembersOpen] = useState(false);
  // const [isLeavingOpen, setIsLeavingOpen] = useState(false);
  // const [isUnsubscribingOpen, setIsUnsubscribingOpen] = useState(false);

  const [popUpWindowOpen, setPopUpWindowOpen] = useState<PopUpWindow>(
    PopUpWindow.Empty
  );

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
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setPopUpWindowOpen(PopUpWindow.AddNewUsersToGroup)
                }
              >
                Add to group
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setPopUpWindowOpen(PopUpWindow.DeleteMemberFromGroup)
                }
              >
                Delete Member
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setPopUpWindowOpen(PopUpWindow.LeaveGroup)}
              >
                Leave Group
              </Button>
            </>
          )}

          {chatData?.roomType === "chat" && (
            <>
              <Button variant="contained" color="warning">
                Delete Contact
              </Button>
              <Button variant="contained" color="error">
                Block User
              </Button>
            </>
          )}

          {chatData?.roomType === "channel" && (
            <>
              <Button
                variant="contained"
                color="warning"
                onClick={() =>
                  setPopUpWindowOpen(PopUpWindow.UnsubscribeFromChannel)
                }
              >
                Unsubscribe
              </Button>
            </>
          )}
        </Box>
        {popUpWindowOpen === PopUpWindow.AddNewUsersToGroup && (
          <AddingList
            isOpen={true}
            onClose={() => setPopUpWindowOpen(PopUpWindow.Empty)}
            chatData={chatData}
          />
        )}
        {popUpWindowOpen === PopUpWindow.DeleteMemberFromGroup && (
          <DeletingList
            isOpen={true}
            onClose={() => setPopUpWindowOpen(PopUpWindow.Empty)}
            chatData={chatData}
          />
        )}
        {popUpWindowOpen === PopUpWindow.LeaveGroup && (
          <LeaveGroup
            isOpen={true}
            onClose={() => setPopUpWindowOpen(PopUpWindow.Empty)}
            chatData={chatData}
          />
        )}
        {popUpWindowOpen === PopUpWindow.UnsubscribeFromChannel && (
          <UnsubscribeChannel
            isOpen={true}
            onClose={() => setPopUpWindowOpen(PopUpWindow.Empty)}
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
  const { socket } = useSocketContext();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const handleGetUsers = (data: User[]) => {
      setUsers(data);
    };

    socket.emit("getOnlyUserRooms", { groupId: chatData?.id });
    socket.on("getOnlyUserRooms", handleGetUsers);

    return () => {
      socket.off("getOnlyUserRooms", handleGetUsers);
    };
  }, [socket]);

  // Toggle room selection
  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Emit forward event
  const handleAddUserToGroup = () => {
    if (selectedUsers.length === 0 || chatData === undefined) return;

    socket.emit("addUserInGroup", {
      userIds: selectedUsers,
      groupId: chatData.id,
    });

    setSelectedUsers([]);
    onClose();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <div className="DefaultColors">
        <DialogTitle>Add New Users</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Search Users..."
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              margin="dense"
              sx={{
                "& .MuiInputBase-input": {
                  color: "var(--color-text-default)", // Text color (white in dark mode)
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "var(--color-border-default)", // Border color
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--color-border-hover)", // Hover border
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--color-primary)", // Focused border (e.g., blue)
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "var(--color-text-secondary)", // Label color (gray)
                  "&.Mui-focused": {
                    color: "var(--color-primary)", // Focused label (e.g., blue)
                  },
                },
              }}
            />
          </Box>

          <List>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <ListItem key={user.id} disablePadding>
                  <ListItemButton onClick={() => handleToggleUser(user.id)}>
                    <Checkbox
                      edge="start"
                      checked={selectedUsers.includes(user.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                    <UserImage
                      src={user.imgURL}
                      width={50}
                      height={50}
                      style={{ borderRadius: "50%" }}
                    />
                    <ListItemText>
                      {user.name} {user.lastName}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No Users Found" />
              </ListItem>
            )}
          </List>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onClose}
              style={{ marginRight: "1rem" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={selectedUsers.length === 0}
              onClick={handleAddUserToGroup}
              sx={{
                // Base styles
                backgroundColor:
                  selectedUsers.length === 0
                    ? "var(--color-bg-disabled)"
                    : "var(--color-primary)",
                color: "white",
                borderRadius: "8px", // Softer rounded corners
                padding: "8px 20px",
                fontWeight: 600, // Semi-bold text
                textTransform: "none", // Disable uppercase transformation
                boxShadow: "none", // Remove default shadow
                transition: "all 0.2s ease-in-out",

                // Hover effect
                "&:hover": {
                  backgroundColor:
                    selectedUsers.length === 0
                      ? "var(--color-bg-disabled)"
                      : "var(--color-primary-dark)",
                  transform: "translateY(-1px)", // Subtle lift
                  boxShadow: "0 6px 12px rgba(255, 255, 255, 0.2)",
                },

                // Active/pressed effect
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "none",
                },

                // Disabled state
                "&:disabled": {
                  backgroundColor: "var(--color-bg-disabled)",
                  color: "var(--color-text-disabled)",
                  cursor: "not-allowed",
                },
              }}
            >
              {selectedUsers.length > 0 ? (
                <>
                  Add{" "}
                  <span style={{ marginLeft: "4px", fontWeight: 700 }}>
                    ({selectedUsers.length})
                  </span>
                </>
              ) : (
                "Add Users"
              )}
            </Button>
          </Box>
        </DialogContent>
      </div>
    </Dialog>
  );
};

const DeletingList = ({
  isOpen,
  onClose,
  chatData,
}: {
  isOpen: boolean;
  onClose: () => void;
  chatData: roomData | undefined;
}) => {
  const { socket } = useSocketContext();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // changes needed
  useEffect(() => {
    const handleGetUsers = (data: User[]) => {
      setUsers(data);
    };

    socket.emit("getOnlyUsersInGroup", { groupId: chatData?.id }); // event change
    socket.on("getOnlyUsersInGroup", handleGetUsers);

    return () => {
      socket.off("getOnlyUsersInGroup", handleGetUsers);
    };
  }, [socket]);

  // Toggle room selection
  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Emit forward event
  const handleDeleteMembersFromGroup = () => {
    if (selectedUsers.length === 0 || chatData === undefined) return;

    socket.emit("deleteMembersFromGroup", {
      membersIds: selectedUsers,
      groupId: chatData.id,
    });

    setSelectedUsers([]);
    onClose();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <div className="DefaultColors">
        <DialogTitle>Add New Users</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Search Users..."
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              margin="dense"
              sx={{
                "& .MuiInputBase-input": {
                  color: "var(--color-text-default)", // Text color (white in dark mode)
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "var(--color-border-default)", // Border color
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--color-border-hover)", // Hover border
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--color-primary)", // Focused border (e.g., blue)
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "var(--color-text-secondary)", // Label color (gray)
                  "&.Mui-focused": {
                    color: "var(--color-primary)", // Focused label (e.g., blue)
                  },
                },
              }}
            />
          </Box>

          <List>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <ListItem key={user.id} disablePadding>
                  <ListItemButton onClick={() => handleToggleUser(user.id)}>
                    <Checkbox
                      edge="start"
                      checked={selectedUsers.includes(user.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                    <UserImage
                      src={user.imgURL}
                      width={50}
                      height={50}
                      style={{ borderRadius: "50%" }}
                    />
                    <ListItemText>
                      {user.name} {user.lastName}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No Users Found" />
              </ListItem>
            )}
          </List>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onClose}
              style={{ marginRight: "1rem" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={selectedUsers.length === 0}
              onClick={handleDeleteMembersFromGroup}
              sx={{
                // Base styles
                backgroundColor:
                  selectedUsers.length === 0
                    ? "var(--color-bg-disabled)"
                    : "var(--color-primary)",
                color: "white",
                borderRadius: "8px", // Softer rounded corners
                padding: "8px 20px",
                fontWeight: 600, // Semi-bold text
                textTransform: "none", // Disable uppercase transformation
                boxShadow: "none", // Remove default shadow
                transition: "all 0.2s ease-in-out",

                // Hover effect
                "&:hover": {
                  backgroundColor:
                    selectedUsers.length === 0
                      ? "var(--color-bg-disabled)"
                      : "var(--color-primary-dark)",
                  transform: "translateY(-1px)", // Subtle lift
                  boxShadow: "0 6px 12px rgba(255, 255, 255, 0.2)",
                },

                // Active/pressed effect
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "none",
                },

                // Disabled state
                "&:disabled": {
                  backgroundColor: "var(--color-bg-disabled)",
                  color: "var(--color-text-disabled)",
                  cursor: "not-allowed",
                },
              }}
            >
              {selectedUsers.length > 0 ? (
                <>
                  Add{" "}
                  <span style={{ marginLeft: "4px", fontWeight: 700 }}>
                    ({selectedUsers.length})
                  </span>
                </>
              ) : (
                "Add Users"
              )}
            </Button>
          </Box>
        </DialogContent>
      </div>
    </Dialog>
  );
};

const LeaveGroup = ({
  isOpen,
  onClose,
  chatData,
}: {
  isOpen: boolean;
  onClose: () => void;
  chatData: roomData | undefined;
}) => {
  const { socket } = useSocketContext();

  const handleLeaveGroup = () => {
    if (!chatData?.id) return;

    socket.emit("leaveGroup", {
      groupId: chatData.id,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <div className="DefaultColors">
        <DialogTitle sx={{ margin: "0 auto", textAlign: "center" }}>
          Leave The Group?
        </DialogTitle>
        <DialogContent>
          <Box mb={2} sx={{ margin: "0 auto", textAlign: "center" }}>
            <Typography variant="body1">
              Are you sure you want to leave "{chatData?.roomName}" group?
            </Typography>
            <Typography variant="body2" mt={1}>
              You won't be able to rejoin unless you're invited again.
            </Typography>
          </Box>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={onClose}
              style={{ marginRight: "1rem" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleLeaveGroup}
              sx={{
                backgroundColor: "var(--color-error)",
                color: "white",
                borderRadius: "8px",
                padding: "8px 20px",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "var(--color-error-dark)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 12px rgba(255, 255, 255, 0.2)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "none",
                },
              }}
            >
              Leave Group
            </Button>
          </Box>
        </DialogContent>
      </div>
    </Dialog>
  );
};

const UnsubscribeChannel = ({
  isOpen,
  onClose,
  chatData,
}: {
  isOpen: boolean;
  onClose: () => void;
  chatData: roomData | undefined;
}) => {
  const { socket } = useSocketContext();

  const handleUnsubscribeChannel = () => {
    if (!chatData?.id) return;

    socket.emit("unsubscribeChannel", {
      channelId: chatData.id,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <div className="DefaultColors">
        <DialogTitle sx={{ margin: "0 auto", textAlign: "center" }}>
          Unsubscribe The Channel?
        </DialogTitle>
        <DialogContent>
          <Box mb={2} sx={{ margin: "0 auto", textAlign: "center" }}>
            <Typography variant="body1">
              Are you sure you want to Unsubscribe "{chatData?.roomName}"
              channel?
            </Typography>
            <Typography variant="body2" mt={1}>
              You will be able to subscribe again.
            </Typography>
          </Box>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={onClose}
              style={{ marginRight: "1rem" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleUnsubscribeChannel}
              sx={{
                backgroundColor: "var(--color-error)",
                color: "white",
                borderRadius: "8px",
                padding: "8px 20px",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "var(--color-error-dark)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 12px rgba(255, 255, 255, 0.2)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "none",
                },
              }}
            >
              Unsubscribe
            </Button>
          </Box>
        </DialogContent>
      </div>
    </Dialog>
  );
};
