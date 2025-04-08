import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useSocketContext } from "../../contexts/socketContext";
import axios from "axios";

interface UserProfile {
  name: string;
  lastName: string;
  imgURL: string;
}

interface Props {
  currentUser: UserProfile;
  onClose: () => void;
  open: boolean;
}

export const EditProfile: React.FC<Props> = ({
  currentUser,
  onClose,
  open,
}) => {
  const { socket } = useSocketContext();
  const [name, setName] = useState(currentUser.name);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const parts = file.name.split(".");
      const extension = parts.length > 1 ? parts.pop() : "";

      const result = await axios.post("http://localhost:3005/upload", {
        extensions: [extension],
      });

      const urls: { url: string; key: string }[] = result.data.urls;
      await axios.put(urls[0].url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      return {
        key: urls[0].key,
        name: file.name,
        url: urls[0].url.split("?")[0],
        saveAsMedia: false,
      };
    } catch (err) {
      console.error("Image upload failed:", err);
      throw err;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedImage = null;
      if (selectedImage) {
        uploadedImage = await uploadImage(selectedImage);
      }

      socket.emit("updateProfile", {
        name,
        lastName,
        ...(uploadedImage && { uploadedImage }),
      });

      onClose();
    } finally {
      setUploading(false);
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} className="DefaultColors">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" mb={2} className="DefaultColors">
          Edit Profile
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar
            src={imagePreview || currentUser.imgURL}
            sx={{ width: 80, height: 80, mb: 1 }}
          />
          <Button component="label" variant="outlined">
            Choose Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {uploading && <Typography variant="caption">Uploading...</Typography>}
        </Box>

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="DefaultColors"
        />
        <TextField
          label="Last Name"
          fullWidth
          margin="normal"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="DefaultColors"
        />

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button onClick={handleClose} sx={{ mr: 2 }} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
