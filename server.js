import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import noteRoutes from "./src/routes/noteRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// MongoDB connection
const mongoURI = process.env.MONGO_URI || `${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// For Vercel (must export handler)
const port = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(` Server running on port ${port}`));
}

export default app;