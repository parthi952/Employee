const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "supersecret_emp_jwt_key_2026", {
    expiresIn: "30d",
  });
};

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});


const getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("-password");
  res.json(admin);
});


const seedDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        name: "Admin User",
        email: "[EMAIL_ADDRESS]",
        password: "admin123",
      });
      console.log("Default Admin created: [EMAIL_ADDRESS] / admin123");
    }
  } catch (error) {
    console.error("Failed to seed default admin:", error.message);
  }
};

module.exports = {
  loginAdmin,
  getMe,
  seedDefaultAdmin,
};
