import asyncHandler from "../middleware/asyncHandler.js";
import Employee from "../model/Employee.js";
import { generateToken } from "../utils/generateToken.js";

// @desc Register Employee
// @route POST /api/employees
//@access Private
export const register = asyncHandler(async (req, res) => {
    // if (req.activeRole && req.activeRole === "admin") {
    const { empId, fullName, email, password, confPassword, mobile } = req.body;
    const existingUser = await Employee.findOne({ email });

    if (existingUser) {
        res.status(400);
        throw new Error("Employee already exists!!!");
    }

    if (password !== confPassword) {
        res.status(400);
        throw new Error("Passwords do not match");
    }

    // const empId = generateEmpId();
    const employee = await Employee.create({
        empId,
        fullName,
        email,
        password,
        mobile,
    });
    if (employee) {
        generateToken(res, employee._id);
        return res.status(201).json({
            _id: employee._id,
            name: employee.fName + " " + employee.lName,
            email: employee.email,
        });
    }
    // } else {
    //     // If user is not an admin, deny access
    //     res.status(403);
    //     throw new Error("Not authorized to register employees");
    // }
});

// @desc Auth user & get token
// @route POST /api/employees/login
// @access Public
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const employee = await Employee.findOne({ email });
    if (!employee.isActive) {
        res.status(401);
        throw new Error("Your account has been deactivated!!");
    }
    if (employee && (await employee.matchPassword(password))) {
        generateToken(res, employee._id);

        res.status(200).json({
            _id: employee._id,
            name: employee.fName + " " + employee.lName,
            email: employee.email,
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc Logout Employee / clear cookie
// @route POST /api/employees/logout
// @access Private
export const logout = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
};
