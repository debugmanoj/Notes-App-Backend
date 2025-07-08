import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import noteRoutes from "./src/routes/noteRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',  // Allows all origins
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
// MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGO_URI in your environment variables.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Start server after DB connects
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });

export default app;