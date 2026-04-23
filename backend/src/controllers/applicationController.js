const Application = require("../models/Application");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

const { validStatusTransitions } = require("../config/constants");

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
  const { programId, universityId, destinationCountry, intake, note } = req.body;
  const studentId = req.user._id;
  const existingApplication = await Application.findOne({
    student: studentId,
    program: programId,
    intake,
  });

  if (existingApplication) {
    throw new HttpError(400, "You have already applied to this program for the selected intake.");
  }

  const application = await Application.create({
    student: studentId,
    program: programId,
    university: universityId,
    destinationCountry,
    intake,
    status: "submitted",
    timeline: [
      { status: "draft", note: "Application started." },
      { status: "submitted", note: note || "Application submitted by student." }
    ]
  });

  res.status(201).json({
    success: true,
    data: application,
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const application = await Application.findById(id);

  if (!application) {
    throw new HttpError(404, "Application not found.");
  }

  const currentStatus = application.status;
  const allowedTransitions = validStatusTransitions[currentStatus] || [];

  if (!allowedTransitions.includes(status)) {
    throw new HttpError(400, `Invalid status transition from ${currentStatus} to ${status}.`);
  }

  application.status = status;
  application.timeline.push({
    status: status,
    note: note || `Status updated to ${status}.`,
    changedAt: new Date()
  });

  await application.save();

  res.json({
    success: true,
    data: application,
  });
});

module.exports = {
  createApplication,
  listApplications,
  updateApplicationStatus,
};

