// controllers/noteController.js
const Note = require('../models/Note');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all notes
// @route   GET /api/v1/notes
// @access  Private
exports.getNotes = asyncHandler(async (req, res, next) => {
  const notes = await Note.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes,
  });
});

// @desc    Get single note
// @route   GET /api/v1/notes/:id
// @access  Private
exports.getNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc    Create new note
// @route   POST /api/v1/notes
// @access  Private
exports.createNote = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const note = await Note.create(req.body);

  res.status(201).json({
    success: true,
    data: note,
  });
});

// @desc    Update note
// @route   PUT /api/v1/notes/:id
// @access  Private
exports.updateNote = asyncHandler(async (req, res, next) => {
  let note = await Note.findOne({ _id: req.params.id, user: req.user.id });

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc    Delete note
// @route   DELETE /api/v1/notes/:id
// @access  Private
exports.deleteNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  await note.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Archive note
// @route   PUT /api/v1/notes/:id/archive
// @access  Private
exports.archiveNote = asyncHandler(async (req, res, next) => {
  let note = await Note.findOne({ _id: req.params.id, user: req.user.id });

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { archived: true }, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc    Unarchive note
// @route   PUT /api/v1/notes/:id/unarchive
// @access  Private
exports.unarchiveNote = asyncHandler(async (req, res, next) => {
  let note = await Note.findOne({ _id: req.params.id, user: req.user.id });

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { archived: false }, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc    Complete note (task)
// @route   PUT /api/v1/notes/:id/complete
// @access  Private
exports.completeNote = asyncHandler(async (req, res, next) => {
  let note = await Note.findOne({ _id: req.params.id, user: req.user.id });

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { completed: true }, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc    Search notes
// @route   GET /api/v1/notes/search
// @access  Private
exports.searchNotes = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  const notes = await Note.find({
    user: req.user.id,
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { tag: { $regex: q, $options: 'i' } },
    ],
  });

  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes,
  });
});
