// routes/authRoutes.js
const authController =
require('../controllers/authController');

console.log(authController);

const { register, login, logout, getMe } = authController;
const express = require('express');
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
