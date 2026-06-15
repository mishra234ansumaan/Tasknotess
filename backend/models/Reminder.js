// models/Reminder.js
const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  note: {
    type: mongoose.Schema.ObjectId,
    ref: 'Note',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  remindAt: {
    type: Date,
    required: true,
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reminder', ReminderSchema);
