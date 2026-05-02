"use client";

import { useEffect, useState } from "react";
import { fetchNotifications } from "../services/api";
import { sortByPriority } from "../utils/priority";
import { logFrontend } from "../utils/logger";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";

export default function PriorityPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchNotifications(1, 20);
        const sorted = sortByPriority(res.notifications);
        setData(sorted.slice(0, 10));
        await logFrontend("info", "component", "Fetched priority notifications");
      } catch {
        await logFrontend("error", "api", "Failed fetching priority notifications");
      }
    }
    load();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Top 10 Priority Notifications</Typography>
      {data.map((n, i) => (
        <Card key={n.ID} sx={{ mb: 2, backgroundColor: i < 3 ? "#fff8e1" : "#ffffff" }}>
          <CardContent>
            <Typography variant="body1">{n.Message}</Typography>
            <Chip label={n.Type} size="small" sx={{ mt: 1 }} />
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>{n.Timestamp}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
