import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const LoadingPage: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
      sx={{
        backgroundColor: "#f0f0f0",
        animation: "fadeIn 1s ease-out", // Simple fade-in animation
      }}
    >
      <CircularProgress
        size={60}
        sx={{ animation: "spin 1s linear infinite" }}
      />
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default LoadingPage;
