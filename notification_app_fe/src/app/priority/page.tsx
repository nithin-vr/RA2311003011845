"use client";

import { useEffect, useState } from "react";
import { fetchNotifications } from "../../services/api";
import { sortByPriority } from "../../utils/priority";
import { logFrontend } from "../../utils/logger";
import {
  Box, Button, Card, CardContent,
  Chip, TextField, Typography, Stack
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function PriorityInboxPage() {
  const [priorityNotifications, setPriorityNotifications] = useState<any[]>([]);
  const [topNCount, setTopNCount] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Re-run whenever the user changes how many top notifications they want to see
  useEffect(() => {
    async function loadPriorityNotifications() {
      try {
        logFrontend("info", "component", "Loading notifications for priority inbox");

        // Fetch 5 pages in parallel (API limit is 10 per page) to get a wide enough pool
        const pages = await Promise.all(
          [1, 2, 3, 4, 5].map(pageNumber => fetchNotifications(pageNumber, 10))
        );

        const allNotifications = pages.flatMap(page => page.notifications ?? []);
        const topNotifications = sortByPriority(allNotifications, topNCount);
        setPriorityNotifications(topNotifications);

        logFrontend("info", "component", `Priority inbox loaded with top ${topNCount} notifications`);
      } catch (error: any) {
        setErrorMessage(error.message || "Failed to load priority notifications");
        logFrontend("error", "api", "Failed to fetch notifications for priority inbox");
      }
    }
    loadPriorityNotifications();
  }, [topNCount]);

  // Top 3 get highlighted more aggressively since they're the most critical
  function getChipColor(rank: number) {
    if (rank === 0) return "error";
    if (rank < 3) return "warning";
    return "default";
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Button onClick={() => router.push("/")} sx={{ mb: 2 }}>← Home</Button>
      <Typography variant="h4" gutterBottom>Priority Inbox</Typography>

      <TextField
        label="Show Top N"
        type="number"
        value={topNCount}
        onChange={(e) => setTopNCount(Math.max(1, Number(e.target.value)))}
        sx={{ mb: 3, width: 130 }}
        slotProps={{ htmlInput: { min: 1, max: 50 } }}
      />

      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>
      )}

      {priorityNotifications.map((notification, rank) => (
        <Card
          key={notification.ID}
          sx={{
            margin: 2,
            backgroundColor: rank < 3 ? "#fff8e1" : "#ffffff",
            borderLeft: `4px solid ${rank < 3 ? "#f9a825" : "#e0e0e0"}`
          }}
        >
          <CardContent>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">{notification.Message}</Typography>
              <Chip label={`#${rank + 1}`} color={getChipColor(rank)} size="small" />
            </Stack>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>{notification.Type}</Typography>
            <Typography variant="caption">{notification.Timestamp}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
