const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { seedDefaultAdmin } = require("./controllers/authController");
const Employee = require("./models/Employee");

dotenv.config();


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
const seedSampleEmployees = async () => {
  try {
    const count = await Employee.countDocuments();
    if (count === 0) {
      const sampleEmployees = [
        {
          name: "Sarah Jenkins",
          email: "sarah.jenkins@company.com",
          phone: "+1 (555) 234-5678",
          department: "Engineering",
          designation: "Senior Full Stack Engineer",
          salary: 115000,
          status: "Active",
          dateOfJoining: new Date("2023-01-15"),
        },
        {
          name: "Michael Chen",
          email: "michael.chen@company.com",
          phone: "+1 (555) 876-5432",
          department: "Engineering",
          designation: "Lead DevOps Architect",
          salary: 130000,
          status: "Active",
          dateOfJoining: new Date("2022-06-10"),
        },
        {
          name: "Emily Rodriguez",
          email: "emily.rodriguez@company.com",
          phone: "+1 (555) 345-6789",
          department: "Human Resources",
          designation: "HR Operations Director",
          salary: 95000,
          status: "Active",
          dateOfJoining: new Date("2021-11-01"),
        },
        {
          name: "David Kim",
          email: "david.kim@company.com",
          phone: "+1 (555) 456-7890",
          department: "Sales",
          designation: "Enterprise Sales Manager",
          salary: 105000,
          status: "Active",
          dateOfJoining: new Date("2023-04-20"),
        },
        {
          name: "Jessica Taylor",
          email: "jessica.taylor@company.com",
          phone: "+1 (555) 567-8901",
          department: "Marketing",
          designation: "Digital Growth Lead",
          salary: 88000,
          status: "Active",
          dateOfJoining: new Date("2023-08-12"),
        },
        {
          name: "Robert Martinez",
          email: "robert.martinez@company.com",
          phone: "+1 (555) 678-9012",
          department: "Finance",
          designation: "Senior Financial Analyst",
          salary: 92000,
          status: "Inactive",
          dateOfJoining: new Date("2022-02-18"),
        },
        {
          name: "Amanda White",
          email: "amanda.white@company.com",
          phone: "+1 (555) 789-0123",
          department: "Design",
          designation: "Principal UI/UX Designer",
          salary: 110000,
          status: "Active",
          dateOfJoining: new Date("2022-09-05"),
        },
      ];
      await Employee.insertMany(sampleEmployees);
      console.log("Sample employees seeded successfully!");
    }
  } catch (err) {
    console.error("Error seeding sample employees:", err.message);
  }
};

// Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedDefaultAdmin();
  await seedSampleEmployees();
});
