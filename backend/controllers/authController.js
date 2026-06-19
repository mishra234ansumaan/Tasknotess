// controllers/authController.js
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const logger = require('../utils/logger');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Create user
  const user = await User.create({
    username,
    email,
    password,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Query the database
    const user = await User.findUserByEmail(email);

    // 2. Checks if the database returned nothing
    if (!user) {
        // Stop here! Send an error status and a message back to the frontend
        return res.status(400).json({ 
            success: false, 
            message: "User not logged in, try signing up." 
        });
    }

    // 3. Verifies password 
    const isMatch = await passwordCheck(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    return res.status(200).json({ success: true, message: "Welcome back!" });
});

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const maxAge = process.env.JWT_COOKIE_EXPIRE
    ? parseInt(process.env.JWT_COOKIE_EXPIRE, 10) * 24 * 60 * 60 * 1000
    : 7 * 24 * 60 * 60 * 1000; // default 7 days

  const options = {
    maxAge,
    httpOnly: true,
    sameSite: 'lax',
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Set cookie and return basic user info only (cookie-only auth)
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
};
