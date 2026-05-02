"use client";

import { useEffect, useState } from "react";
import { fetchNotifications } from "../../services/api";
import { sortByPriority } from "../../utils/priority";
import { logFrontend } from "../../utils/logger";
import { Box, Button, Card, CardContent, Chip, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function PriorityPage() {
  const [data, setData] = useState<any[]>([]);
  const [limit, setLimit] = useState(10);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        await logFrontend("info", "component", "Loading priority notifications");
        const res = await fetchNotifications(1, 50);
        const sorted = sortByPriority(res.notifications);
        setData(sorted.slice(0, limit));
        await logFrontend("info", "component", `Showing top ${limit} priority notifications`);
      } catch {
        await logFrontend("error", "api", "Failed fetching priority notifications");
      }
    }
    load();
  }, [limit]);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Button onClick={() => router.push("/")} sx={{ mb: 2 }}>← Back</Button>
      <Typography variant="h4" gutterBottom>Priority Notifications</Typography>

      <TextField
        label="Top N"
        type="number"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
        sx={{ mb: 3, width: 120 }}
        slotProps={{ htmlInput: { min: 1, max: 50 } }}
      />

      {data.map((n, i) => (
        <Card key={n.ID} sx={{ margin: 2, backgroundColor: i < 3 ? "#fff8e1" : "#ffffff" }}>
          <CardContent>
            <Typography variant="h6">{n.Message}</Typography>
            <Typography color="text.secondary">{n.Type}</Typography>
            <Typography variant="caption">{n.Timestamp}</Typography>
            <Chip label={`#${i + 1}`} size="small" sx={{ ml: 1 }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
