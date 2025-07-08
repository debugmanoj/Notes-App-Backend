import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/emailSimulator.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    isVerified: false,
  });
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

   await sendVerificationEmail(email, token);

  res.status(201).json({ message: "Registered. Please verify email." });
};

export const verifyEmail = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    await user.save();

res.status(200).json({ message: "Email verified" });
  } catch {
    res.status(400).json({ message: "Token invalid or expired" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  if (!user.isVerified)
    return res.status(400).json({ message: "Please verify your email" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({
    token,
    user: { id: user._id, email: user.email, name: user.name },
  });
};



export const reLogin=async(req,res)=>{
   const { email, id } = req.body;

  const user = await User.findOne({ email, _id: id });
  if (!user) return res.status(401).json({ message: "Invalid session" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });

}
