const asyncHandler = require("express-async-handler");
const Employee = require("../models/Employee");

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await Employee.aggregate([
    {
      $facet: {
        counts: [
          {
            $group: {
              _id: null,
              totalEmployees: { $sum: 1 },
              activeEmployees: {
                $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] },
              },
              inactiveEmployees: {
                $sum: { $cond: [{ $eq: ["$status", "Inactive"] }, 1, 0] },
              },
              totalSalary: { $sum: "$salary" },
            },
          },
        ],
        departmentBreakdown: [
          {
            $group: {
              _id: "$department",
              count: { $sum: 1 },
              avgSalary: { $avg: "$salary" },
              totalSalary: { $sum: "$salary" },
            },
          },
          { $sort: { count: -1 } },
        ],
      },
    },
  ]);

  const resultCounts = stats[0]?.counts[0] || {
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    totalSalary: 0,
  };

  const departmentStats = stats[0]?.departmentBreakdown || [];

  res.json({
    totalEmployees: resultCounts.totalEmployees,
    activeEmployees: resultCounts.activeEmployees,
    inactiveEmployees: resultCounts.inactiveEmployees,
    totalSalary: resultCounts.totalSalary,
    departmentBreakdown: departmentStats,
  });
});

module.exports = {
  getDashboardStats,
};
