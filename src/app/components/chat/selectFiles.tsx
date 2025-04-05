import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
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
import { formatFileSize } from "../../utils/formatFileSize";
import { useSendMessage } from "../../services/sendMessage";
import { useChatFormContext } from "@/app/contexts/chatFormContext";
import { useFilesContext } from "@/app/contexts/filesContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  bgcolor: "background.paper",
  backgroundColor: "var(--bg-color-text-default)",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

export default function SelectFiles({ roomId }: { roomId: string }) {
  const { messageText, handleSetText } = useChatFormContext();
  const handleSendMessage = useSendMessage();

  const {
    files,
    handleCloseWindow,
    handleFileChange,
    handleFileTypeChange,
    handleRemoveFile,
  } = useFilesContext();

  return (
    <div>
      <Modal
        open
        onClose={handleCloseWindow}
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
            <Typography
              id="modal-title"
              variant="h6"
              color="var(--color-text-default)"
            >
              Select Files
            </Typography>
            <IconButton
              onClick={handleCloseWindow}
              sx={{ color: "var(--color-text-default)" }}
            >
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
                    <InsertDriveFileIcon
                      sx={{ color: "var(--color-text-default)" }}
                    />
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
                          {formatFileSize(file.file.size)}
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
                          handleFileTypeChange(index);
                        }}
                      />
                    </div>
                  ) : null}
                  <IconButton onClick={() => handleRemoveFile(index)}>
                    <DeleteIcon sx={{ color: "var(--color-text-default)" }} />
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
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">Add</label>
          </Button>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Message"
            value={messageText}
            onChange={(e) => handleSetText(e.target.value)}
            margin="normal"
            sx={{
              color: "var(--color-text-default) !important",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--foreground)",
                  transition: "border-color 0.2s ease-in-out",
                },
                "&:hover fieldset": {
                  borderColor: "var(--foreground-shadow) !important",
                },
                "&.Mui-focused fieldset": {
                  borderColor: (theme) =>
                    `${theme.palette.primary.main} !important`,
                },
                "&.Mui-focused:hover fieldset": {
                  // Prevent hover effect when focused
                  borderColor: (theme) =>
                    `${theme.palette.primary.main} !important`,
                },
              },
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            <Button variant="outlined" onClick={handleCloseWindow}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleCloseWindow();
                handleSendMessage(roomId);
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
