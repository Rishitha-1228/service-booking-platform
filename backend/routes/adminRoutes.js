const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllBookings,
  updateBookingStatus,
  deleteUser,
  getAllPayments,
} = require("../controllers/adminController");

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/bookings", getAllBookings);
router.put("/bookings/:id/status", updateBookingStatus);
router.delete("/users/:id", deleteUser);
router.get("/payments", getAllPayments);

module.exports = router;