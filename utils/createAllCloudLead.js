import axios from "axios"
import jsonminify from "jsonminify"
import { hmacToken } from "./generateHMAC.js"

export const createAllCloudLead = async (lead,createdBorrower) => {
    const { fullName, mobile, pan, aadhaar, city, state, pinCode, businessName, loanAmount, turnover } = lead

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
            StateId: state.split(" ").join(""),
            Landmark: null,
            UploadDocumentDTOCollection: null,
            jsonPLAssetOtherInfo: "N/A"
        }
    }))

    try {
        const leadToken = await hmacToken("https://staging.allcloud.in/apiv2pawansut/api/LeadDetail/AddLeadDetail", minifiedLead)
        console.log("lead Token", leadToken)

        const createdLead = await axios.post(`https://staging.allcloud.in/apiv2pawansut/api/LeadDetail/AddLeadDetail`, minifiedLead, {
            headers: {
                "Authorization": leadToken,
                "Content-Type": "application/json"
            }
        })

        return createdLead

    } catch (error) {
        console.log('lead error',error)
        throw new Error(error.message || "Error in Lead creation!")

    }



}