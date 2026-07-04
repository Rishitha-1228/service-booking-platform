const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
//const xss = require("xss-clean");

dotenv.config();

const app = express();

/* ============================
   TRUST PROXY (Render)
============================ */

app.set("trust proxy", 1);

/* ============================
   MIDDLEWARE
============================ */

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Compression
app.use(compression());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// XSS Protection
//app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests. Please try again later.",
});

app.use(limiter);

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

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/services", require("./routes/serviceRoutes"));

app.use("/api/bookings", require("./routes/bookingRoutes"));

app.use("/api/payments", require("./routes/paymentRoutes"));

app.use("/api/notifications", require("./routes/notificationRoutes"));

app.use("/api/admin", require("./routes/adminRoutes"));

/* ============================
   HOME ROUTE
============================ */

app.get("/", (req, res) => {
  res.json({
    success: true,
    project: "Service Booking Platform",
    version: "Week 9",
    status: "Server Running Successfully 🚀",
  });
});

/* ============================
   HEALTH CHECK
============================ */

app.get("/health", (req, res) => {
  res.json({
    success: true,
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
  console.error(err);

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
  console.log(
    "📦 Environment :",
    process.env.NODE_ENV || "development"
  );
  console.log("=====================================");
});