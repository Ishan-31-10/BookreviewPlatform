import React from "react";
import { Box, CircularProgress } from "@mui/material";

export default function Loader({ fullScreen = false }) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" py={fullScreen ? 8 : 2}>
      <CircularProgress />
    </Box>
  );
}
