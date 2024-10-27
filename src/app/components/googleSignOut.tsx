import { signOut } from "@/auth";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
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
      >
        Sign Out
      </Button>
    </form>
  );
}
