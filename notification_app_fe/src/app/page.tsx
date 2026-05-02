"use client";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const nav = useRouter();

  return (
    <Box sx={{ p: 5, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Notification Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        View and manage your notifications
      </Typography>
      <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
        <Button variant="contained" size="large" onClick={() => nav.push("/all")}>
          All Notifications
        </Button>
        <Button variant="outlined" size="large" onClick={() => nav.push("/priority")}>
          Priority View
        </Button>
      </Box>
    </Box>
  );
}
