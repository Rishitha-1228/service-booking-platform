const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// ================================
// REGISTER
// ================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
    });

    // Welcome email
    await sendEmail(
      email,
      "🎉 Welcome to SkillConnect Pro!",
      `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#5B21B6,#7C3AED);padding:30px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:26px;">🎉 Welcome to SkillConnect Pro!</h1>
        </div>
        <div style="padding:30px;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your account has been created successfully. You can now browse services and make bookings.</p>
          <div style="background:#F3F4F6;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;"><strong>Email:</strong> ${email}</p>
          </div>
          <p>Start exploring our services today!</p>
        </div>
        <div style="background:#F9FAFB;padding:20px;text-align:center;border-top:1px solid #E5E7EB;">
          <p style="color:#9CA3AF;font-size:12px;margin:0;">SkillConnect Pro — Connecting Clients with Top Professionals</p>
        </div>
      </div>
      `
    );

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "servicebooking123",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// LOGIN
// ================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "servicebooking123",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };