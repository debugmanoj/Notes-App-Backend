import Note from "../models/Note.js";

export const createNote = async (req, res) => {
  const { title, content, category,tags} = req.body;
  const note = await Note.create({
    user: req.user._id,
    title,
    content,
    category,
    tags
  });
  res.status(201).json(note);
};

export const getNotes = async (req, res) => {
  const { category, search,tag ,startDate, endDate } = req.query;
  let query = { user: req.user._id };

  if (category) query.category = category;
  if (search) query.content = { $regex: search, $options: "i" };
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  if (tag) {
    query.tags = { $in: tag.split(",") };
  }


  const notes = await Note.find(query)
  .sort({ pinned: -1, createdAt: -1 });
  res.json(notes);
};

// controllers/noteController.js
export const pinNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });

  note.pinned = !note.pinned;
  await note.save();
  res.json(note);
};

export const updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  res.json(note);
};

export const deleteNote = async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: "Note deleted" });
};
