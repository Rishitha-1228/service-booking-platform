const User = require("../models/User");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

// ================================
// DASHBOARD STATS
// ================================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const payments = await Payment.find({ status: "Paid" });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const recentBookings = await Booking.find()
      .populate("userId")
      .populate("serviceId")
      .sort({ createdAt: -1 })
      .limit(10);

    // Bookings by status
    const pendingCount = await Booking.countDocuments({ status: "Pending" });
    const paidCount = await Booking.countDocuments({ status: "Paid" });
    const completedCount = await Booking.countDocuments({ status: "Completed" });
    const cancelledCount = await Booking.countDocuments({ status: "Cancelled" });
    const confirmedCount = await Booking.countDocuments({ status: "Confirmed" });

    // Revenue per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: "Paid", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      totalUsers,
      totalServices,
      totalBookings,
      totalRevenue,
      recentBookings,
      bookingStats: {
        pending: pendingCount,
        paid: paidCount,
        completed: completedCount,
        cancelled: cancelledCount,
        confirmed: confirmedCount,
      },
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// GET ALL USERS
// ================================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// GET ALL BOOKINGS (ADMIN)
// ================================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email phone")
      .populate("serviceId", "title price category")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// UPDATE BOOKING STATUS (ADMIN)
// ================================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId").populate("serviceId");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Notify user
    if (booking.userId?.email) {
      const emoji = { Confirmed: "✅", Completed: "🎉", Cancelled: "❌", Paid: "💳" }[status] || "📢";
      await sendEmail(
        booking.userId.email,
        `${emoji} Your Booking has been ${status} — SkillConnect Pro`,
        `<div style="font-family:Arial,sans-serif;padding:30px;">
          <h2>${emoji} Booking ${status}</h2>
          <p>Hi <strong>${booking.userId.name}</strong>,</p>
          <p>Your booking for <strong>${booking.serviceId?.title || "service"}</strong> has been <strong>${status}</strong>.</p>
          <p>Booking ID: <code>${booking._id}</code></p>
        </div>`
      );
      if (booking.userId.phone) {
        await sendSMS(booking.userId.phone, `${emoji} Booking ${status}: SkillConnect Pro\nService: ${booking.serviceId?.title}\nID: ${booking._id}`);
      }
    }

    res.json({ message: "Status updated", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// DELETE USER (ADMIN)
// ================================
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// GET ALL PAYMENTS (ADMIN)
// ================================
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({ path: "bookingId", populate: [{ path: "userId", select: "name email" }, { path: "serviceId", select: "title" }] })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};