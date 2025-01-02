import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";
import Lead from "../model/Lead.js";
import jsonminify from "jsonminify"
import AadhaarDetails from "../model/AadhaarDetails.js";
import { createBorrower } from "../utils/generateBorrower.js";
import { createAllCloudLead } from "../utils/createAllCloudLead.js";

// @desc Create loan leads
// @route POST /api/leads
// @access Public
export const createLead = asyncHandler(async (req, res) => {
    const {
        fullName,
        pan,
        aadhaar,
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
        aadhaar,
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
        sentToAllCloud: { $ne: true },
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

// @desc Get a lead
// @route GET /api/leads/:id
// @access Private
export const getLead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lead = await Lead.findOne({ _id: id });

    if (!lead) {
        res.status(404);
        throw new Error("Lead not found!!");
    }
    return res.json({
        lead,
    });
});

// @desc Get a lead
// @route GET /api/sendDataToAllcloud/:id
// @access Private
export const sendDataToAllcloud = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lead = await Lead.findOne({ _id: id });
    if (!lead) {
        res.status(404);
        throw new Error("Lead not found!!");
    }
    const uniqueId = `${lead.fullName.split(" ")[0].toLowerCase()}${lead.aadhaar.slice(-4)}`
    const aadhaarDetails = await AadhaarDetails.findOne({ uniqueId })

    const createdBorrower = await createBorrower(lead, aadhaarDetails)

    console.log('created borrower', createdBorrower)
    const createdLead = await createAllCloudLead(lead, createdBorrower)
    lead.sentToAllCloud = true
    await lead.save()

    console.log('lead created', createdLead)



    
    return res.json({
        message: "lead Forwarded",
    });
});


// @desc Get all leads
// @route GET /api/leads/forwarded-leads
// @access Private
export const forwardedLeads = asyncHandler(async (req, res) => {
    console.log('forwarded leads',)
    const page = parseInt(req.query.page); // current page
    const limit = parseInt(req.query.limit); // items per page
    const skip = (page - 1) * limit;

    const query = {
        sentToAllCloud: { $eq: true },
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


// @desc Create loan leads
// @route POST /api/leads/updateLead
// @access Private
export const updateLead = asyncHandler(async (req, res) => {


    // const existingLead = await Lead.findById()



    return res.json({ message: "updated" });
});


