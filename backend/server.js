const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const compression = require("compression");

dotenv.config();

const app = express();

/* ============================
   MIDDLEWARE
============================ */

app.use(cors());
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));

/* ============================
   DATABASE CONNECTION
============================ */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed");
    console.log(err.message);
  });

/* ============================
   API ROUTES
============================ */

// Authentication
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

// Services
app.use(
  "/api/services",
  require("./routes/serviceRoutes")
);

// Bookings
app.use(
  "/api/bookings",
  require("./routes/bookingRoutes")
);

// Payments
app.use(
  "/api/payments",
  require("./routes/paymentRoutes")
);

// Notifications
app.use(
  "/api/notifications",
  require("./routes/notificationRoutes")
);

// Admin
app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

/* ============================
   TEST ROUTES
============================ */

app.get("/", (req, res) => {
  res.json({
    success: true,
    project: "Service Booking Platform",
    version: "Week 8",
    status: "Server Running Successfully 🚀",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database: "Connected",
    server: "Running",
    timestamp: new Date(),
  });
});

/* ============================
   404 HANDLER
============================ */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

/* ============================
   ERROR HANDLER
============================ */

app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ============================
   SERVER
============================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=====================================");
  console.log("🚀 Service Booking Platform");
  console.log(`🌍 Server : http://localhost:${PORT}`);
  console.log("📦 Environment :", process.env.NODE_ENV || "development");
  console.log("=====================================");
});