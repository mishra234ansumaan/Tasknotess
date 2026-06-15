// routes/reminderRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createReminder, getReminders, deleteReminder } = require('../controllers/reminderController');

const router = express.Router();

router.route('/').post(protect, createReminder).get(protect, getReminders);
router.route('/:id').delete(protect, deleteReminder);

module.exports = router;
