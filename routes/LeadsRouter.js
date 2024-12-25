import express from "express";
import { createLead, forwardedLeads, getAllLeads, getLead, sendDataToAllcloud } from "../controller/leads.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Other routes
router.route("/").post(createLead).get(protect, getAllLeads);
router.route("/:id").get(protect, getLead);
// router.patch("/send/:id", protect, recommendLead);

// send lead to Allcloud

router.route("/sendDataToAllcloud/:id").post(protect, sendDataToAllcloud)

// Forwarded Leads 
router.route("/forwarded-leads").get(protect, forwardedLeads)

export default router;
