const asyncHandler = require("express-async-handler");
const Employee = require("../models/Employee");

const getEmployees = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search ? req.query.search.trim() : "";
  const department = req.query.department ? req.query.department.trim() : "";
  const status = req.query.status ? req.query.status.trim() : "";

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } },
    ];
  }

  if (department && department !== "All") {
    query.department = department;
  }

  if (status && status !== "All") {
    query.status = status;
  }

  const count = await Employee.countDocuments(query);
  const employees = await Employee.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({
    employees,
    page,
    pages: Math.ceil(count / limit) || 1,
    total: count,
  });
});


const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    res.json(employee);
  } else {
    res.status(404);
    throw new Error("Employee not found");
  }
});


const createEmployee = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    department,
    designation,
    salary,
    status,
    dateOfJoining,
  } = req.body;

  if (!name || !email || !phone || !department || !designation || salary === undefined) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }
 
  const existingEmployee = await Employee.findOne({ email: email.toLowerCase() });
  if (existingEmployee) {
    res.status(400);
    throw new Error("An employee with this email already exists");
  }

  const employee = await Employee.create({
    name,
    email,
    phone,
    department,
    designation,
    salary: Number(salary),
    status: status || "Active",
    dateOfJoining: dateOfJoining || Date.now(),
  });

  res.status(201).json(employee);
});


const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }


  if (req.body.email && req.body.email.toLowerCase() !== employee.email) {
    const emailExists = await Employee.findOne({ email: req.body.email.toLowerCase() });
    if (emailExists) {
      res.status(400);
      throw new Error("An employee with this email already exists");
    }
  }

  employee.name = req.body.name || employee.name;
  employee.email = req.body.email ? req.body.email.toLowerCase() : employee.email;
  employee.phone = req.body.phone || employee.phone;
  employee.department = req.body.department || employee.department;
  employee.designation = req.body.designation || employee.designation;
  employee.salary = req.body.salary !== undefined ? Number(req.body.salary) : employee.salary;
  employee.status = req.body.status || employee.status;
  employee.dateOfJoining = req.body.dateOfJoining || employee.dateOfJoining;

  const updatedEmployee = await employee.save();
  res.json(updatedEmployee);
});


const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    await Employee.deleteOne({ _id: req.params.id });
    res.json({ message: "Employee removed successfully" });
  } else {
    res.status(404);
    throw new Error("Employee not found");
  }
});

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
