import { signIn } from "@/auth";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
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
        Sign in with Google
      </Button>
    </form>
  );
}
