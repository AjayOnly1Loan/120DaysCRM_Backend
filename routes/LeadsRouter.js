import express from "express";
import { createLead, getAllLeads , getLead } from "../controller/leads.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Other routes
router.route("/").post(createLead).get(protect, getAllLeads);
router.route("/:id").get(protect , getLead);
// router.patch("/send/:id", protect, recommendLead);

export default router;
