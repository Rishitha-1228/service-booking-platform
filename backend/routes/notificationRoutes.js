const express = require("express");

const router = express.Router();

const {
  sendEmail,
  sendSMS,
  createNotification,
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

// ==========================================
// Email Notification
// POST /api/notifications/email
// ==========================================
router.post("/email", sendEmail);

// ==========================================
// SMS Notification
// POST /api/notifications/sms
// ==========================================
router.post("/sms", sendSMS);

// ==========================================
// Save Notification
// POST /api/notifications
// ==========================================
router.post("/", createNotification);

// ==========================================
// Get All Notifications
// GET /api/notifications
// ==========================================
router.get("/", getNotifications);

// ==========================================
// Mark Notification As Read
// PUT /api/notifications/:id
// ==========================================
router.put("/:id", markAsRead);

module.exports = router;