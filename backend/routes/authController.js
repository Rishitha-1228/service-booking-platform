const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {

  const {
    name,
    email,
    password,
    phone,
  } = req.body;

  try {

    const userExists =
      await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User Exists" });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
      });

    res.status(201).json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};