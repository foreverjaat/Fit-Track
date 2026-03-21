import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// @desc   Register new user
// @route  POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, age, weight, height, gender, goal } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name, email,
      password: hashedPassword,
      age, weight, height, gender, goal,
    });

    res.status(201).json({
      _id:    user._id,
      name:   user.name,
      email:  user.email,
      age:    user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      goal:   user.goal,
      token:  generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({
      _id:    user._id,
      name:   user.name,
      email:  user.email,
      age:    user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      goal:   user.goal,
      token:  generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get current logged in user
// @route  GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc   Update user profile
// @route  PUT /api/auth/update
const updateProfile = async (req, res) => {
  try {
    const { name, age, weight, height, gender, goal } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, age, weight, height, gender, goal },
      { new: true, runValidators: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Change password
// @route  PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { register, login, getMe, updateProfile, changePassword };
