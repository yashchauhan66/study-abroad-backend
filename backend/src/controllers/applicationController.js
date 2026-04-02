const Application = require("../models/Application");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

const listApplications = asyncHandler(async (req, res) => {
  const { studentId, status } = req.query;
  const filters = {};

  if (studentId) {
    filters.student = studentId;
  }

  if (status) {
    filters.status = status;
  }

  const applications = await Application.find(filters)
    .populate("student", "fullName email role")
    .populate("program", "title degreeLevel tuitionFeeUsd")
    .populate("university", "name country city")
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: applications,
  });
});

const createApplication = asyncHandler(async (req, res) => {
  throw new HttpError(
    501,
    "Application creation is intentionally incomplete for the assignment."
  );
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  throw new HttpError(
    501,
    "Application status transitions are intentionally incomplete for the assignment."
  );
});

module.exports = {
  createApplication,
  listApplications,
  updateApplicationStatus,
};
