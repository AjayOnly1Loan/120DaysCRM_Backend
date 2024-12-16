import asyncHandler from "../middleware/asyncHandler.js";
import Lead from "../models/Leads.js";

// @desc Create loan leads
// @route POST /api/leads
// @access Public
export const createLead = asyncHandler(async (req, res) => {
    const {
        fullName,
        pan,
        mobile,
        personalEmail,
        businessName,
        propertyType,
        gstNo,
        loanAmount,
        turnover,
        pinCode,
        state,
        city,
    } = req.body;

    const newLead = await Lead.create({
        fullName,
        pan,
        mobile,
        personalEmail,
        businessName,
        propertyType,
        gstNo,
        loanAmount,
        turnover,
        pinCode,
        state,
        city,
    });
    return res.json({ newLead });
});

// @desc Get all leads
// @route GET /api/leads
// @access Private
export const getAllLeads = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // current page
    const limit = parseInt(req.query.limit) || 10; // items per page
    const skip = (page - 1) * limit;

    const query = {
        sendToAllCloud: { $ne: true },
    };

    const leads = await Lead.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: -1 });

    const totalLeads = await Lead.countDocuments(query);

    return res.json({
        totalLeads,
        totalPages: Math.ceil(totalLeads / limit),
        currentPage: page,
        leads,
    });
});
