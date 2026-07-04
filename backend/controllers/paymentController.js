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
    const { bookingId, amount, serviceName, userName, userEmail, userPhone } = req.body;
 
    // Update booking status if bookingId provided
    let booking = null;
    if (bookingId) {
      booking = await Booking.findByIdAndUpdate(
  bookingId,
  {
    status: "Completed",
    paymentStatus: "Paid",
  },
  { new: true }
).populate("serviceId").populate("userId");
    }
 
    // Generate transaction ID
    const transactionId = "TXN" + Math.floor(100000000 + Math.random() * 900000000);
 
    // Save payment record
    const payment = await Payment.create({
      bookingId: bookingId || null,
      amount,
      status: "Paid",
      transactionId,
      paymentMethod: "Demo Payment",
    });
 
    // ── Send Email Notification ──
    const emailTo = userEmail || (booking?.userId?.email);
    const emailName = userName || (booking?.userId?.name) || "Customer";
    const serviceTitle = serviceName || (booking?.serviceId?.title) || "Service";
    const bookingDate = booking?.bookingDate || "N/A";
    const bookingTime = booking?.bookingTime || "N/A";
 
    if (emailTo) {
      await sendEmail(
        emailTo,
        "✅ Payment Successful — SkillConnect Pro",
        `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#5B21B6,#7C3AED);padding:30px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:26px;">✅ Payment Successful!</h1>
            <p style="color:#DDD6FE;margin:8px 0 0 0;">SkillConnect Pro</p>
          </div>
          <div style="padding:30px;">
            <p style="font-size:16px;">Hi <strong>${emailName}</strong>,</p>
            <p>Your payment has been received successfully. Here are your booking details:</p>
            <div style="background:#F3F4F6;border-radius:8px;padding:20px;margin:20px 0;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#6B7280;font-size:14px;">Service</td><td style="padding:8px 0;font-weight:bold;text-align:right;">${serviceTitle}</td></tr>
                <tr><td style="padding:8px 0;color:#6B7280;font-size:14px;">Booking Date</td><td style="padding:8px 0;font-weight:bold;text-align:right;">${bookingDate}</td></tr>
                <tr><td style="padding:8px 0;color:#6B7280;font-size:14px;">Time Slot</td><td style="padding:8px 0;font-weight:bold;text-align:right;">${bookingTime}</td></tr>
                <tr><td style="padding:8px 0;color:#6B7280;font-size:14px;">Amount Paid</td><td style="padding:8px 0;font-weight:bold;color:#059669;text-align:right;">₹${amount}</td></tr>
                <tr><td style="padding:8px 0;color:#6B7280;font-size:14px;">Transaction ID</td><td style="padding:8px 0;font-family:monospace;font-size:12px;text-align:right;">${transactionId}</td></tr>
                <tr><td style="padding:8px 0;color:#6B7280;font-size:14px;">Status</td><td style="padding:8px 0;color:#059669;font-weight:bold;text-align:right;">✅ Paid</td></tr>
              </table>
            </div>
            <p style="color:#6B7280;font-size:13px;">Our team will contact you shortly to confirm your appointment. Thank you for choosing SkillConnect Pro!</p>
          </div>
          <div style="background:#F9FAFB;padding:20px;text-align:center;border-top:1px solid #E5E7EB;">
            <p style="color:#9CA3AF;font-size:12px;margin:0;">SkillConnect Pro — Connecting Clients with Top Professionals</p>
          </div>
        </div>
        `
      );
    }
 
    // ── Send SMS Notification ──
    const smsTo = userPhone || (booking?.userId?.phone);
    if (smsTo) {
      await sendSMS(
        smsTo,
        `✅ Payment Successful! SkillConnect Pro\nService: ${serviceTitle}\nAmount: ₹${amount}\nTxn ID: ${transactionId}\nWe'll contact you soon.`
      );
    }
 
    res.json({
      success: true,
      message: "Payment Successful",
      payment,
      booking,
      transactionId,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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