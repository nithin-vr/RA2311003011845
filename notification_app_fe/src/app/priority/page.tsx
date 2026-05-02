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

export default function PriorityInbox() {
  const [topItems, setTopItems] = useState<any[]>([]);
  const [showCount, setShowCount] = useState(10);
  const nav = useRouter();

  useEffect(() => {
    async function loadPriority() {
      try {
        await logFrontend("info", "component", "Fetching notifications for priority view");
        const resp = await fetchNotifications(1, 50);
        const ranked = sortByPriority(resp.notifications);
        setTopItems(ranked.slice(0, showCount));
        await logFrontend("info", "component", `Priority view showing top ${showCount}`);
      } catch {
        await logFrontend("error", "api", "Failed to load priority notifications");
      }
    }
    loadPriority();
  }, [showCount]);

  const chipColor = (i: number) => i === 0 ? "error" : i < 3 ? "warning" : "default";

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Button onClick={() => nav.push("/")} sx={{ mb: 2 }}>← Home</Button>
      <Typography variant="h4" gutterBottom>Priority Inbox</Typography>

      <TextField
        label="Show Top N"
        type="number"
        value={showCount}
        onChange={(e) => setShowCount(Math.max(1, Number(e.target.value)))}
        sx={{ mb: 3, width: 130 }}
        slotProps={{ htmlInput: { min: 1, max: 50 } }}
      />

      {topItems.map((item, idx) => (
        <Card
          key={item.ID}
          sx={{
            margin: 2,
            backgroundColor: idx < 3 ? "#fff8e1" : "#ffffff",
            borderLeft: `4px solid ${idx < 3 ? "#f9a825" : "#e0e0e0"}`
          }}
        >
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{item.Message}</Typography>
              <Chip label={`#${idx + 1}`} color={chipColor(idx)} size="small" />
            </Stack>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>{item.Type}</Typography>
            <Typography variant="caption">{item.Timestamp}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
