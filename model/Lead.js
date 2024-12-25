import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        pan: {
            type: String,
            required: true,
        },
        aadhaar: {
            type: String,
            require: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        personalEmail: {
            type: String,
            required: true,
        },
        businessName: {
            type: String,
            required: true,
        },
        propertyType: {
            type: String,
            required: true,
            enum: ["own", "rental"],
        },
        gstNo: {
            type: String,
        },
        loanAmount: {
            type: Number,
            required: true,
        },
        turnover: {
            type: Number,
            required: true,
        },
        pinCode: {
            type: Number,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        isAadhaarVerified: { type: Boolean, default: false },
        isAadhaarDetailsSaved: { type: Boolean, default: false },
        isPanVerified: { type: Boolean, default: false },
        sentToAllCloud: { type: Boolean, default: false },
        source: {
            type: String,
            required: true,
            enum: ["website", "bulk", "landingPage", "whatsapp", "app"],
            default: "website",
        },
    },
    { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
