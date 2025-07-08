import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    content: { type: String },
    category: { type: String },
    tags: [{ type: String }], 
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
