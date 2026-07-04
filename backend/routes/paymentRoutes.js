const express = require("express");

const {
  createOrder,
  verifyPayment,
  getPayments,
  getPaymentById,
} = require("../controllers/paymentController");

const router = express.Router();

/*
=========================================
DEMO PAYMENT API
=========================================
*/

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Payment API Working",
  });
});

// Create Demo Order
router.post("/create-order", createOrder);

// Verify Demo Payment
router.post("/verify", verifyPayment);

// Get All Payments
router.get("/", getPayments);

// Get Payment By Id
router.get("/:id", getPaymentById);

module.exports = router;