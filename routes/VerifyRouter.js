import express from "express";
import {
    generateAadhaarLink,
    aadhaarOtp,
    saveAadhaarDetails,
    checkAadhaarDetails,
    verifyAadhaar,
} from "../controller/aadhaar.js";
// import { bankVerification } from "../Controllers/applicantPersonalDetails.js";
// import {
//     getPanDetails,
//     savePanDetails,
//     panAadhaarLink,
// } from "../Controllers/panController.js";
import {
    getPanDetails,
    savePanDetails,
    panAadhaarLink,
} from "../controller/pan.js";
// import {
//     emailVerify,
//     verifyEmailOtp,
//     fetchCibil,
//     cibilReport,
//     mobileGetOtp,
//     verifyOtp,
// } from "../controller/leads.js";
import { aadhaarMiddleware, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Mobile Verify
// router.post("/mobile/get-otp", mobileGetOtp);
// router.post("/mobile/verify-otp", verifyOtp);

// Bank Verify
// router.route("/bank/:id").post(bankVerification);

// send Aadhaar verification mail
router.route("/generate-link/:id").get(generateAadhaarLink);

// aadhaar verify
// router.post('/aadhaar/:id');
router.route("/aadhaar/:id").get( aadhaarOtp);
// Aadhaar OTP submitted by Borrower
router.post("/submit-aadhaar-otp/:id",  saveAadhaarDetails);
router
    .route("/verifyAadhaar/:id")
    .get(protect, checkAadhaarDetails)
    .patch(protect, verifyAadhaar);

// email verify
// router.patch("/email/:id", protect, emailVerify);
// router.patch("/email-otp/:id", protect, verifyEmailOtp);

// pan verify
router
    .route("/pan/:id")
    .get(protect, getPanDetails)
    .post(protect, savePanDetails);
router.post("/pan-aadhaar-link/:id", panAadhaarLink);

// fetch CIBIL
// router.get("/equifax/:id", protect, fetchCibil);
// router.get("/equifax-report/:id", protect, cibilReport);
export default router;
