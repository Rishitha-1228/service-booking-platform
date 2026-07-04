const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    service: {
      type: String,
      required: true,
    },

    bookingDate: {
      type: String,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      default: "Booking",
    },

    status: {
      type: String,
      enum: ["Pending", "Sent", "Failed"],
      default: "Pending",
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);