import axios from "axios"
import jsonminify from "jsonminify"
import { hmacToken } from "./generateHMAC.js"
import { statesMap } from "./stateCode.js"


export const createBorrower = async (lead, aadhaarDetails) => {
    const { fullName, mobile, pan, aadhaar, city, state, pinCode } = lead
    const updatedDOB = aadhaarDetails.details.dob.split("-").reverse().join("-")
    const stateCode = statesMap.get(state)

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
        PrimaryStateId: stateCode,
    }))
    try {
        const borrowerToken = await hmacToken("https://staging.allcloud.in/apiv2pawansut/api/Customer/SaveCustomerData", minifiedBorrower)
        console.log('borrower token', borrowerToken)
        const createdBorrower = await axios.post(`https://staging.allcloud.in/apiv2pawansut/api/Customer/SaveCustomerData`,
            minifiedBorrower,
            {
                headers: {
                    "Authorization": borrowerToken,
                    "Content-Type": "application/json"
                }
            }
        )
        return createdBorrower

    } catch (error) {
        if (error.response) {
            console.error('Server Error:', error.response.status);
            console.error('Response Data:', error.response.data);
            throw new Error(error.response.data || "Error in borrower creation response")
        } else if (error.request) {
            console.error('No Response Received:', error.request);
            throw new Error(error.request.message || "Error in borrower creation")
        } else {
            console.error('Error Setting Up Request:', error.message);
            throw new Error(error.message || "Error in borrower creation")
          }

    }



}
