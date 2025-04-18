"use client";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
import URLS from "@/app/utils/urls";

export function SignOutButton() {
  const handleSubmit = () => {
    const result = axios.get(URLS.signOut);
  };
  return (
    <>
      <Button
        variant="outlined"
        type="submit"
        startIcon={<GoogleIcon />}
        sx={{
          textTransform: "none",
          borderColor: "#4285F4",
          color: "#4285F4",
          "&:hover": {
            borderColor: "#357AE8",
            backgroundColor: "rgba(66, 133, 244, 0.04)",
          },
        }}
        onClick={handleSubmit}
      >
        Sign Out
      </Button>
    </>
  );
}
