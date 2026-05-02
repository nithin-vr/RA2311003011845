"use client";

import { useEffect, useState } from "react";
import { fetchNotifications } from "../services/api";
import { logFrontend } from "../utils/logger";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";

export default function AllNotifications() {
  const [data, setData] = useState<any[]>([]);
  const [viewed, setViewed] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("viewed") || "[]");
    setViewed(stored);

    async function load() {
      try {
        const res = await fetchNotifications(1, 10);
        setData(res.notifications);
        await logFrontend("info", "component", "Fetched all notifications");
      } catch {
        await logFrontend("error", "api", "Failed fetching notifications");
      }
    }
    load();
  }, []);

  function markViewed(id: string) {
    const updated = [...viewed, id];
    setViewed(updated);
    localStorage.setItem("viewed", JSON.stringify(updated));
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>All Notifications</Typography>
      {data.map((n) => (
        <Card
          key={n.ID}
          sx={{ mb: 2, backgroundColor: viewed.includes(n.ID) ? "#f5f5f5" : "#e3f2fd", cursor: "pointer" }}
          onClick={() => markViewed(n.ID)}
        >
          <CardContent>
            <Typography variant="body1">{n.Message}</Typography>
            <Chip label={n.Type} size="small" sx={{ mt: 1 }} />
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>{n.Timestamp}</Typography>
            {!viewed.includes(n.ID) && <Chip label="New" color="primary" size="small" sx={{ mt: 1, ml: 1 }} />}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
