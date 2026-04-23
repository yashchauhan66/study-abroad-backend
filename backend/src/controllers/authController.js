const Student = require("../models/Student");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const { generateToken } = require("../utils/token");

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const userExists = await Student.findOne({ email });

  if (userExists) {
    throw new HttpError(400, "User already exists");
  }

  const user = await Student.create({
    fullName,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    throw new HttpError(400, "Invalid user data");
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await Student.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    throw new HttpError(401, "Invalid email or password");
  }
});

const me = asyncHandler(async (req, res) => {
  const user = await Student.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      success: true,
      data: user,
    });
  } else {
    throw new HttpError(404, "User not found");
  }
});

module.exports = {
  register,
  login,
  me,
};

