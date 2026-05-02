"use client";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>Notification System</Typography>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
        <Button variant="contained" onClick={() => router.push("/all")}>All Notifications</Button>
        <Button variant="outlined" onClick={() => router.push("/priority")}>Priority Notifications</Button>
      </Box>
    </Box>
  );
}
