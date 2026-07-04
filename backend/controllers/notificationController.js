const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

// --------------------
// Nodemailer
// --------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --------------------
// Twilio
// --------------------
const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ==================================================
// Send Email
// ==================================================
const sendEmail = async (req, res) => {
  try {
    const { email, service, amount } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Booking Confirmation - SkillConnect Pro",
      html: `
      <div style="font-family:Arial;padding:20px;background:#f8f9fa">
        <div style="max-width:600px;margin:auto;background:white;border-radius:10px;padding:30px">

          <h2 style="color:#6C63FF;text-align:center">
            🎉 Booking Confirmed
          </h2>

          <p>Hello,</p>

          <p>Your booking has been confirmed successfully.</p>

          <table style="width:100%;margin-top:20px">
            <tr>
              <td><strong>Service</strong></td>
              <td>${service}</td>
            </tr>

            <tr>
              <td><strong>Amount Paid</strong></td>
              <td>₹${amount}</td>
            </tr>

            <tr>
              <td><strong>Status</strong></td>
              <td style="color:green">Paid</td>
            </tr>

            <tr>
              <td><strong>Date</strong></td>
              <td>${new Date().toLocaleString()}</td>
            </tr>
          </table>

          <br>

          <p>
            Thank you for choosing
            <strong>SkillConnect Pro</strong>.
          </p>

        </div>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==================================================
// Send SMS
// ==================================================
const sendSMS = async (req, res) => {
  try {
    const { phone, service, amount } = req.body;

    const message = await twilioClient.messages.create({
      body: `SkillConnect Pro

Booking Confirmed

Service : ${service}

Amount : ₹${amount}

Status : Paid

Thank you for choosing SkillConnect Pro.`,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });

    res.json({
      success: true,
      sid: message.sid,
      message: "SMS Sent Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==================================================
// Save Notification
// ==================================================
const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);

    res.status(201).json(notification);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ==================================================
// Get Notifications
// ==================================================
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ==================================================
// Mark Notification Read
// ==================================================
const markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findByIdAndUpdate(
        req.params.id,
        {
          read: true,
        },
        {
          new: true,
        }
      );

    res.json(notification);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  sendEmail,
  sendSMS,
  createNotification,
  getNotifications,
  markAsRead,
};