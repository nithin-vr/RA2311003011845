"use client";

import { useEffect, useState } from "react";
import { fetchNotifications } from "../../services/api";
import { logFrontend } from "../../utils/logger";
import {
  Box, Button, Card, CardContent, Chip,
  MenuItem, Select, Typography, Stack
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Restore which notifications the user has already read from their last session
  useEffect(() => {
    const previouslyRead = JSON.parse(localStorage.getItem("readNotifs") || "[]");
    setReadNotificationIds(previouslyRead);
  }, []);

  // Re-fetch whenever the user changes the page or switches the type filter
  useEffect(() => {
    async function loadNotifications() {
      try {
        setErrorMessage("");
        const data = await fetchNotifications(currentPage, 10, selectedType);
        if (!data.notifications) throw new Error(JSON.stringify(data));
        setNotifications(data.notifications);
        logFrontend("info", "component", `Loaded page ${currentPage}, filter: ${selectedType || "none"}`);
      } catch (error: any) {
        setErrorMessage(error.message || "Failed to load notifications");
        setNotifications([]);
        logFrontend("error", "api", "Failed to fetch notifications from the API");
      }
    }
    loadNotifications();
  }, [currentPage, selectedType]);

  function handleTypeFilterChange(type: string) {
    setSelectedType(type);
    setCurrentPage(1); // Reset to first page whenever the filter changes
    logFrontend("info", "component", `Notification type filter changed to: ${type || "all"}`);
  }

  function markNotificationAsRead(id: string) {
    if (readNotificationIds.includes(id)) return; // Already marked, nothing to do
    const updatedReadIds = [...readNotificationIds, id];
    setReadNotificationIds(updatedReadIds);
    localStorage.setItem("readNotifs", JSON.stringify(updatedReadIds));
    logFrontend("info", "component", `Notification ${id} marked as read`);
  }

  function goToPreviousPage() {
    const previousPage = currentPage - 1;
    setCurrentPage(previousPage);
    logFrontend("info", "component", `Navigated to page ${previousPage}`);
  }

  function goToNextPage() {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    logFrontend("info", "component", `Navigated to page ${nextPage}`);
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Button onClick={() => router.push("/")} sx={{ mb: 2 }}>← Home</Button>
      <Typography variant="h4" gutterBottom>All Notifications</Typography>

      <Select
        value={selectedType}
        onChange={(e) => handleTypeFilterChange(e.target.value)}
        displayEmpty
        sx={{ mb: 3, minWidth: 200 }}
      >
        <MenuItem value="">Show All</MenuItem>
        <MenuItem value="Placement">Placement</MenuItem>
        <MenuItem value="Result">Result</MenuItem>
        <MenuItem value="Event">Event</MenuItem>
      </Select>

      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>
      )}

      {notifications.map((notification) => {
        const isRead = readNotificationIds.includes(notification.ID);
        return (
          <Card
            key={notification.ID}
            onClick={() => markNotificationAsRead(notification.ID)}
            sx={{
              margin: 2,
              backgroundColor: isRead ? "#fafafa" : "#e3f2fd",
              cursor: "pointer",
              borderLeft: isRead ? "4px solid #ccc" : "4px solid #1976d2"
            }}
          >
            <CardContent>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">{notification.Message}</Typography>
                {!isRead && <Chip label="Unread" color="primary" size="small" />}
              </Stack>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>{notification.Type}</Typography>
              <Typography variant="caption">{notification.Timestamp}</Typography>
            </CardContent>
          </Card>
        );
      })}

      <Stack direction="row" spacing={2} sx={{ mt: 3, alignItems: "center" }}>
        <Button variant="outlined" disabled={currentPage === 1} onClick={goToPreviousPage}>← Prev</Button>
        <Typography>Page {currentPage}</Typography>
        <Button variant="outlined" onClick={goToNextPage}>Next →</Button>
      </Stack>
    </Box>
  );
}
