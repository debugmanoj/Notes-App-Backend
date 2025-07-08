import express from "express";
import { register, login, verifyEmail,reLogin} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/relogin", reLogin);
router.post("/verify", verifyEmail);

export default router;
