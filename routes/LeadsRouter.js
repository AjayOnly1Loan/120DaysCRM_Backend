import express from "express";
import { createLead, getAllLeads } from "../controller/leads.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Other routes
router.route("/").post(createLead).get(protect, getAllLeads);
// router.patch("/send/:id", protect, recommendLead);

export default router;
