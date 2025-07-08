import express from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  pinNote
} from "../controllers/noteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getNotes).post(createNote);
router.route("/:id").put(updateNote).delete(deleteNote);
router.patch("/:id/pin", pinNote);
// router.patch("/notes/:id/pin", protect, pinNote);

export default router;
