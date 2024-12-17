import express from "express";
const router = express.Router();
import { login, logout, register } from "../controller/employees.js";
import { protect } from "../middleware/authMiddleware.js";

// Route to register a new user
router.route("/register").post(register);

// Route to login
router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;
