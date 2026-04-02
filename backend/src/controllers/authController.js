const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

function starterMessage(capability) {
  return `${capability} is intentionally left incomplete for the candidate assignment.`;
}

const register = asyncHandler(async (req, res) => {
  throw new HttpError(501, starterMessage("Registration"));
});

const login = asyncHandler(async (req, res) => {
  throw new HttpError(501, starterMessage("Login"));
});

const me = asyncHandler(async (req, res) => {
  throw new HttpError(
    501,
    starterMessage("Fetching the authenticated user profile")
  );
});

module.exports = {
  register,
  login,
  me,
};
