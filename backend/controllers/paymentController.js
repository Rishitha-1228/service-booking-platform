const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");
 
// ================================
// CREATE DEMO ORDER
// ================================
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
 
    // Pure demo order — no Razorpay API call
    // This fixes the "Payment Failed" / "Something went wrong" error
    const order = {
      id: "DEMO_ORDER_" + Date.now(),
      amount: amount,
      currency: "INR",
      status: "created",
      demo: true,
    };
 
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
 
// ================================
// VERIFY / COMPLETE DEMO PAYMENT
// ================================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      bookingId,
      amount,
      serviceName,
      userName,
      userEmail,
      userPhone,
    } = req.body;

    // Generate Transaction ID FIRST
    const transactionId =
      "TXN" + Math.floor(100000000 + Math.random() * 900000000);

    let booking = null;

    // Update booking
    if (bookingId) {
      booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paymentStatus: "Paid",
          bookingStatus: "Confirmed",
          transactionId,
          paymentMethod: "Demo Payment",
        },
        { new: true }
      )
        .populate("serviceId")
        .populate("userId");
    }

    // Save payment
    const payment = await Payment.create({
      bookingId: bookingId || null,
      amount,
      status: "Paid",
      transactionId,
      paymentMethod: "Demo Payment",
    });

    // Email
    const emailTo = userEmail || booking?.userId?.email;
    const emailName = userName || booking?.userId?.name || "Customer";
    const serviceTitle =
      serviceName || booking?.serviceId?.title || "Service";
    const bookingDate = booking?.bookingDate || "N/A";
    const bookingTime = booking?.timeSlot || "N/A";

    if (emailTo) {
      await sendEmail(
        emailTo,
        "Payment Successful - SkillConnect Pro",
        `
        <h2>Payment Successful</h2>
        <p>Hello <b>${emailName}</b>,</p>
        <p>Your payment has been received successfully.</p>
        <hr/>
        <p><b>Service:</b> ${serviceTitle}</p>
        <p><b>Date:</b> ${bookingDate}</p>
        <p><b>Time:</b> ${bookingTime}</p>
        <p><b>Amount:</b> ₹${amount}</p>
        <p><b>Transaction ID:</b> ${transactionId}</p>
        <p><b>Status:</b> Paid</p>
        `
      );
    }

    // SMS
    const smsTo = userPhone || booking?.userId?.phone;

    if (smsTo) {
      await sendSMS(
        smsTo,
        `Payment Successful\nService: ${serviceTitle}\nAmount: ₹${amount}\nTxn: ${transactionId}`
      );
    }

    res.json({
      success: true,
      message: "Payment Successful",
      booking,
      payment,
      transactionId,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ================================
// GET ALL PAYMENTS
// ================================
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("bookingId").sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// ================================
// GET PAYMENT BY ID
// ================================
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment Not Found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};