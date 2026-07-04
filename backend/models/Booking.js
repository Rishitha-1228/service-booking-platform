const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: false,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    service: {
      type: String,
      required: true,
      trim: true,
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

    address: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    bookingStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    transactionId: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      default: "Demo Payment",
    },
  },
  {
    timestamps: true,
  }
);

// Auto Generate Booking ID
bookingSchema.pre("save", function (next) {
  if (!this.bookingId) {
    this.bookingId =
      "BOOK-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 1000);
  }

  next();
});

module.exports = mongoose.model(
  "Booking",
  bookingSchema
);