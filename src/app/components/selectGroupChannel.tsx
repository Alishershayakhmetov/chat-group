import React, { useEffect, useState } from "react";
import { Modal, Snackbar, Alert } from "@mui/material";
import styles from "../styles/leftSlide.module.css";
import { Close } from "@mui/icons-material";
import { useSocketContext } from "../contexts/socketContext";
import { createGroupList } from "../interfaces/interfaces";
import UserImage from "./userImage";

export const SelectGroupChannel: React.FC<{
  entity: string;
  onClose: () => void;
}> = ({ entity, onClose }) => {
  const socket = useSocketContext();
  const [title, setTitle] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("/picture-697.svg");
  const [peopleList, setPeopleList] = useState<createGroupList[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  useEffect(() => {
    // Fetch the user list for the group
    socket.emit("createNewGroup");
    socket.on(
      "createNewGroup",
      (result: { success: boolean; users: createGroupList[] }) => {
        if (result.success) {
          setPeopleList(result.users);
        }
      }
    );

    // Cleanup listener on unmount
    return () => {
      socket.off("createNewGroup");
    };
  }, [socket]);

  const handleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = () => {
    if (!title.trim()) {
      setSnackbar({
        open: true,
        message: "Please provide a title.",
        severity: "error",
      });
      return;
    }

    if (entity === "group" && selectedUsers.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one user.",
        severity: "error",
      });
      return;
    }

    if (entity === "group") {
      // Send the selected users and group title to the backend
      socket.emit("createGroup", { title, users: selectedUsers });
    } else {
      // Handle channel creation logic here
      socket.emit("createChannel", { title });
    }

    setSnackbar({
      open: true,
      message: `${
        entity === "group" ? "Group" : "Channel"
      } created successfully!`,
      severity: "success",
    });
    onClose(); // Close the modal after creation
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="select-group-channel-modal"
      aria-describedby="create-group-or-channel"
    >
      <div className={styles.modalContent}>
        <header>
          <Close
            sx={{ fontSize: 40, color: "black" }}
            className={styles.closeButton}
            onClick={onClose}
          />
        </header>
        <div className={styles.imageAndNameHeader}>
          <div className={styles.imageContainer}>
            <img src={imagePreview} alt={`${entity} image`} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.imageInput}
            />
          </div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Create a {entity === "group" ? "Group" : "Channel"}
          </h1>
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${
                entity === "group" ? "Group" : "Channel"
              } Title`}
              className={styles.titleInput}
            />
            <Snackbar
              open={snackbar.open}
              autoHideDuration={3000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              sx={{ position: "initial" }}
            >
              <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </div>
        </div>
        {entity === "group" ? (
          <div className={styles.peopleListContainer}>
            <h3 style={{ marginBottom: "12px" }}>
              Select People for the Group
            </h3>
            <PeopleList
              peopleList={peopleList}
              selectedUsers={selectedUsers}
              onSelectUser={handleUserSelection}
            />
          </div>
        ) : (
          <ChannelParamList />
        )}
        <button onClick={handleCreate} className={styles.createButton}>
          Create {entity === "group" ? "Group" : "Channel"}
        </button>
      </div>
    </Modal>
  );
};

const PeopleList = ({
  peopleList,
  selectedUsers,
  onSelectUser,
}: {
  peopleList: createGroupList[];
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
}) => {
  return (
    <ul>
      {peopleList.map((person) => (
        <li key={person.id} className={styles.personItem}>
          <UserImage
            src={person.imgURL}
            alt={`${person.name} ${person.lastName}`}
            className={styles.personImage}
          />
          <div>
            <p>{person.name}</p>
            <p>{person.lastName}</p>
          </div>
          <input
            type="checkbox"
            id={`person-${person.id}`}
            className={styles.checkbox}
            checked={selectedUsers.includes(person.id)}
            onChange={() => onSelectUser(person.id)}
          />
        </li>
      ))}
    </ul>
  );
};

const ChannelParamList = () => {
  return (
    <div className={styles.channelParamList}>
      <h3>Set Channel Parameters</h3>
      <div className={styles.paramField}>
        <label htmlFor="topic">Channel Topic:</label>
        <input
          type="text"
          id="topic"
          placeholder="Enter channel topic"
          className={styles.input}
        />
      </div>
      <div className={styles.paramField}>
        <label htmlFor="visibility">Visibility:</label>
        <select id="visibility" className={styles.select}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
    </div>
  );
};
