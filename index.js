import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import cors
import connectDB from "./config/db.js";
import "dotenv/config.js";
import morgan from "morgan";
import leadRouter from "./routes/LeadsRouter.js";
import employeeRouter from "./routes/EmployeesRouter.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const PORT = process.env.PORT || 3000;
connectDB();

const app = express();

// Middleware
// CORS configuration
var corsOption = {
    origin: [
        "http://localhost:5173",
        "https://120daysfinance.com",
        "http://www.120daysfinance.com",
        "https://crm.120daysfinance.com",
        "https://www.crm.120daysfinance.com",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //cookie parser middlerware

// Logging middleware (optional)
app.use(morgan("dev")); // Log HTTP requests

// Routes
app.get("/", (req, res) => {
    res.send("API is running.......");
});

app.use("/api/leads", leadRouter); // Use the lead routes
app.use("/api/employees", employeeRouter); // Use the employee routes

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
