"use client";

import { useEffect, useState } from "react";
import { fetchNotifications } from "../../services/api";
import { logFrontend } from "../../utils/logger";
import {
  Box, Button, Card, CardContent, Chip,
  MenuItem, Select, Typography
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function AllNotifications() {
  const [data, setData] = useState<any[]>([]);
  const [viewed, setViewed] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("viewed") || "[]");
    setViewed(stored);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchNotifications(page, 10, type);
        setData(res.notifications);
        await logFrontend("info", "component", `Fetched notifications - page ${page}, filter: ${type || "all"}`);
      } catch {
        await logFrontend("error", "api", "Failed fetching notifications");
      }
    }
    load();
  }, [page, type]);

  function markViewed(id: string) {
    if (viewed.includes(id)) return;
    const updated = [...viewed, id];
    setViewed(updated);
    localStorage.setItem("viewed", JSON.stringify(updated));
    logFrontend("info", "component", `Notification ${id} marked as viewed`);
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Button onClick={() => router.push("/")} sx={{ mb: 2 }}>← Back</Button>
      <Typography variant="h4" gutterBottom>All Notifications</Typography>

      <Select
        value={type}
        onChange={(e) => { setType(e.target.value); setPage(1); logFrontend("info", "component", `Filter changed to ${e.target.value || "all"}`); }}
        displayEmpty
        sx={{ mb: 3, minWidth: 180 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Placement">Placement</MenuItem>
        <MenuItem value="Result">Result</MenuItem>
        <MenuItem value="Event">Event</MenuItem>
      </Select>

      {data.map((n) => {
        const isViewed = viewed.includes(n.ID);
        return (
          <Card
            key={n.ID}
            onClick={() => markViewed(n.ID)}
            sx={{ margin: 2, backgroundColor: isViewed ? "#fff" : "#e3f2fd", cursor: "pointer" }}
          >
            <CardContent>
              <Typography variant="h6">{n.Message}</Typography>
              <Typography color="text.secondary">{n.Type}</Typography>
              <Typography variant="caption">{n.Timestamp}</Typography>
              {!isViewed && <Chip label="New" color="primary" size="small" sx={{ ml: 1 }} />}
            </CardContent>
          </Card>
        );
      })}

      <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "center" }}>
        <Button variant="outlined" disabled={page === 1} onClick={() => { setPage(page - 1); logFrontend("info", "component", `Page changed to ${page - 1}`); }}>Prev</Button>
        <Typography>Page {page}</Typography>
        <Button variant="outlined" onClick={() => { setPage(page + 1); logFrontend("info", "component", `Page changed to ${page + 1}`); }}>Next</Button>
      </Box>
    </Box>
  );
}
