"use client";

import { useEffect, useState } from "react";
import { fetchNotifications } from "../../services/api";
import { logFrontend } from "../../utils/logger";
import {
  Box, Button, Card, CardContent, Chip,
  MenuItem, Select, Typography, Stack
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("");
  const nav = useRouter();

  // load read state from storage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("readNotifs") || "[]");
    setReadIds(saved);
  }, []);

  // re-fetch whenever page or filter changes
  useEffect(() => {
    async function loadData() {
      try {
        const resp = await fetchNotifications(currentPage, 10, activeFilter);
        setNotifications(resp.notifications);
        await logFrontend("info", "component", `Loaded page ${currentPage}, filter=${activeFilter || "none"}`);
      } catch {
        await logFrontend("error", "api", "Could not load notifications");
      }
    }
    loadData();
  }, [currentPage, activeFilter]);

  function handleFilterChange(val: string) {
    setActiveFilter(val);
    setCurrentPage(1);
    logFrontend("info", "component", `Filter set to: ${val || "all"}`);
  }

  function markAsRead(id: string) {
    if (readIds.includes(id)) return;
    const updated = [...readIds, id];
    setReadIds(updated);
    localStorage.setItem("readNotifs", JSON.stringify(updated));
    logFrontend("info", "component", `Marked notification ${id} as read`);
  }

  function goToPrev() {
    const next = currentPage - 1;
    setCurrentPage(next);
    logFrontend("info", "component", `Navigated to page ${next}`);
  }

  function goToNext() {
    const next = currentPage + 1;
    setCurrentPage(next);
    logFrontend("info", "component", `Navigated to page ${next}`);
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Button onClick={() => nav.push("/")} sx={{ mb: 2 }}>← Home</Button>
      <Typography variant="h4" gutterBottom>All Notifications</Typography>

      <Select
        value={activeFilter}
        onChange={(e) => handleFilterChange(e.target.value)}
        displayEmpty
        sx={{ mb: 3, minWidth: 200 }}
      >
        <MenuItem value="">Show All</MenuItem>
        <MenuItem value="Placement">Placement</MenuItem>
        <MenuItem value="Result">Result</MenuItem>
        <MenuItem value="Event">Event</MenuItem>
      </Select>

      {notifications.map((item) => {
        const isRead = readIds.includes(item.ID);
        return (
          <Card
            key={item.ID}
            onClick={() => markAsRead(item.ID)}
            sx={{
              margin: 2,
              backgroundColor: isRead ? "#fafafa" : "#e3f2fd",
              cursor: "pointer",
              borderLeft: isRead ? "4px solid #ccc" : "4px solid #1976d2"
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{item.Message}</Typography>
                {!isRead && <Chip label="Unread" color="primary" size="small" />}
              </Stack>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>{item.Type}</Typography>
              <Typography variant="caption">{item.Timestamp}</Typography>
            </CardContent>
          </Card>
        );
      })}

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
        <Button variant="outlined" disabled={currentPage === 1} onClick={goToPrev}>← Prev</Button>
        <Typography>Page {currentPage}</Typography>
        <Button variant="outlined" onClick={goToNext}>Next →</Button>
      </Stack>
    </Box>
  );
}
