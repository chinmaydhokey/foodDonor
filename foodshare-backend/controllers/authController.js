const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, address, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name, email, password: hashedPassword, role, address, phone
    });

    await user.save();
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "User already exists or error occurred" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
};
