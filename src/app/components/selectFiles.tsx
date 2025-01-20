import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

export default function SelectFiles({
  files,
  text,
  onDeleteFile,
  onClose,
  onTextChange,
  onFileChange,
  onSend,
  onFileTypeChange,
}: {
  files: { file: File; saveAsMedia: boolean }[];
  text: string;
  onDeleteFile: (index: number) => void;
  onClose: () => void;
  onTextChange: (text: string) => void;
  onFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    saveAsMedia?: boolean
  ) => void;
  onSend: () => Promise<void>;
  onFileTypeChange: (index: number) => void;
}) {
  return (
    <div>
      <Modal
        open
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography id="modal-title" variant="h6">
              Select Files
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <List
            sx={{
              maxHeight: "60vh", // Set the max height of the list
              overflowY: "auto", // Enable scrolling for overflow
            }}
          >
            {files.map((file, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <InsertDriveFileIcon />
                  </ListItemIcon>
                  <div style={{ flexGrow: 1 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          {file.file.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="gray">
                          {`${(file.file.size / 1024).toFixed(2)} KB`}
                        </Typography>
                      }
                    />
                  </div>
                  {/* Check if file is an image or video */}
                  {file.file.type.startsWith("image/") ||
                  file.file.type.startsWith("video/") ? (
                    <div style={{ whiteSpace: "nowrap", marginRight: 16 }}>
                      Save as File?
                      <Checkbox
                        checked={file.saveAsMedia}
                        onChange={(e) => {
                          onFileTypeChange(index);
                        }}
                      />
                    </div>
                  ) : null}
                  <IconButton onClick={() => onDeleteFile(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button variant="outlined">
            <input
              type="file"
              id="file-upload"
              multiple
              style={{ display: "none" }}
              onChange={onFileChange}
            />
            <label htmlFor="file-upload">Add</label>
          </Button>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Message"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            margin="normal"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onClose();
                onSend();
              }}
            >
              Send
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
