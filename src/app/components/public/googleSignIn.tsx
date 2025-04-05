"use client";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function SignInButton() {
  const handleSubmit = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google`;
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
        Sign in with Google
      </Button>
    </>
  );
}
