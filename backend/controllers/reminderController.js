// controllers/reminderController.js
const Reminder = require('../models/Reminder');
const Note = require('../models/Note');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create reminder
// @route   POST /api/v1/reminders
// @access  Private
exports.createReminder = asyncHandler(async (req, res, next) => {
  const { noteId, remindAt } = req.body;

  const note = await Note.findOne({ _id: noteId, user: req.user.id });

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${noteId}`, 404));
  }

  const reminder = await Reminder.create({
    note: noteId,
    user: req.user.id,
    remindAt,
  });

  res.status(201).json({
    success: true,
    data: reminder,
  });
});

// @desc    Get all reminders for a user
// @route   GET /api/v1/reminders
// @access  Private
exports.getReminders = asyncHandler(async (req, res, next) => {
  const reminders = await Reminder.find({ user: req.user.id }).populate('note');

  res.status(200).json({
    success: true,
    count: reminders.length,
    data: reminders,
  });
});

// @desc    Delete reminder
// @route   DELETE /api/v1/reminders/:id
// @access  Private
exports.deleteReminder = asyncHandler(async (req, res, next) => {
  const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user.id });

  if (!reminder) {
    return next(new ErrorResponse(`Reminder not found with id of ${req.params.id}`, 404));
  }

  await reminder.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
