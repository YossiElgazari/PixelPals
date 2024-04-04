const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    user = new User({
      username,
      email,
      passwordHash: password,
    });

    // Save the user
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle potential errors
    res.status(500).json({ message: "Error registering new user", error: error.message });
  }
};
