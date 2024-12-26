import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";
import Lead from "../model/Lead.js";
import jsonminify from "jsonminify"
import AadhaarDetails from "../model/AadhaarDetails.js";

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
    console.log('wrong')
    const { id } = req.params;
    const lead = await Lead.findOne({ _id: id });
    const { fullName, mobile, pan, aadhaar, city, state, pinCode, businessName, loanAmount,turnover } = lead
    const uniqueId = `${fullName.split(" ")[0].toLowerCase()}${aadhaar.slice(-4)}`
    const aadhaarDetails = await AadhaarDetails.findOne({ uniqueId: uniqueId })
    const updatedDOB = aadhaarDetails.details.dob.split("-").reverse().join("-")
    const minifiedBorrower = jsonminify(JSON.stringify({
        CustomerId: 0,
        FirstName: fullName.split(" ")[0],
        LastName: fullName.split(" ").slice(1).join(" "),
        DOB: updatedDOB,
        ContactNumber: Number(mobile),
        AadarCard: aadhaar,
        PANCard: pan,
        FatherName: "",
        Gender: 0,
        BankNo: "",
        BankDetailId: "",
        IFSCCode: "",
        BranchName: "",
        BankName: "",
        BankAccountName: "",
        PrimaryAddressLine1: city,
        PrimaryArea: city,
        PrimaryTown: city,
        PrimaryPostcode: pinCode.toString(),
        PrimaryStateId: "01",
    }))




    const getAuthToken = async (url,data) => {
        const headers = {
            "Content-Type": "application/json",
            "appid": process.env.APP_ID,
            "secrettoken": process.env.SECRET_TOKEN,
            "usertoken": process.env.USER_TOKEN,
            "x-api-key": process.env.X_API_KEY,
            "url": url
        }

        const tokenRes = await axios.post(`https://uat-auth-ace.allcloud.app/enterprise-generatetoken`, data, { headers })
        return tokenRes.data
    }

    const borrowerToken = await getAuthToken("https://staging.allcloud.in/apiv2pawansut/api/Customer/SaveCustomerData",minifiedBorrower)



    const createdBorrower = await axios.post(`https://staging.allcloud.in/apiv2pawansut/api/Customer/SaveCustomerData`, minifiedBorrower, {
        headers: {
            "Authorization": borrowerToken,
            "Content-Type": "application/json"
        }
    })

    const minifiedLead = jsonminify(JSON.stringify({
        LeadDetailId: 0,
        ProductTypeId: "BusinessLoan",
        LoanState: 0,
        LoanAmount: loanAmount,
        LoanTenure: 4,
        LoanCategoryId: "General",
        CompanyRoleId: 198,
        CentreName: "Default Centre",
        LeadSourceId: 3,
        LeadSourceDetailId: 2,
        PurposeofLoan: "Business Activities",
        SchemeId: 3,
        LoanSegmentId: "General",
        SubmitLead: true,
        DealerId: null,
        lstLeadCustomers: [
            {
                BorrowerId: createdBorrower.data.CustomerId,
                BorrowerTypeId: 0,
                OrderTypeId: 0,
                RelationToBorrower: 53
            }
        ],
        PLSalaryBorrower: null,
        objPLOrganizationBorrowerDTO: {
            PLOrganizationBorrowerId: 0,
            OrganizationName: businessName,
            AnnualProfit: turnover,
            AddressId: 0,
            IncorporationDate: "2024-05-12",
            OrganizationType: "3",
            Sector: "finance",
            Designation: null,
            PAN: null,
            TAN: null,
            GST: null,
            NoOfEmployees: 0,
            AnnualIncome: turnover,
            AddressLine1: city,
            Area: city,
            Town: city,
            Postcode: pinCode,
            StateId: state,
            Landmark: null,
            UploadDocumentDTOCollection: null,
            jsonPLAssetOtherInfo: "N/A"
        }
    }))

    const leadToken = await getAuthToken("https://staging.allcloud.in/apiv2pawansut/api/LeadDetail/AddLeadDetail",minifiedLead)
    console.log("lead Token",leadToken)

    const createdLead = await axios.post(`https://staging.allcloud.in/apiv2pawansut/api/LeadDetail/AddLeadDetail`, minifiedLead, {
        headers: {
            "Authorization": leadToken,
            "Content-Type": "application/json"
        }
    })

    console.log('lead created', createdLead)



    if (!lead) {
        res.status(404);
        throw new Error("Lead not found!!");
    }
    return res.json({
        token: createdLead.data,
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

    console.log('update lead',req.body)

    // const existingLead = await Lead.findById()
   

   
    return res.json({ message:"updated" });
});


