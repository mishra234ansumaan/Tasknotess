// models/Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    maxlength: [100, 'Title can not be more than 100 characters'],
  },
  content: {
    type: String,
    maxlength: [1000, 'Content can not be more than 1000 characters'],
  },
  category: {
    type: String,
    enum: ['Work', 'Personal', 'Study', 'Idea', 'Other'],
    default: 'Other',
  },
  tag: {
    type: [String],
    maxlength: [50, 'Tag can not be more than 50 characters'],
  },
  color: {
    type: String,
    default: '#FFFFFF',
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Note', NoteSchema);
