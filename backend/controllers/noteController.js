// controllers/noteController.js
const Note = require('../models/Note');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all notes (user-scoped)
// @route   GET /api/v1/notes
exports.getNotes = asyncHandler(async (req, res, next) => {
  const userId = req.user ? req.user.id : null;
  const query = userId ? { user: userId } : {};

  const notes = await Note.find(query);

  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes,
  });
});

// @desc    Get single note
// @route   GET /api/v1/notes/:id
exports.getNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  // Ensure owner access if note has a user
  if (note.user && req.user && note.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to access this note', 401));
  }

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc    Create new note
// @route   POST /api/v1/notes
exports.createNote = asyncHandler(async (req, res, next) => {
  const payload = { ...req.body };
  if (req.user) payload.user = req.user.id;

  const note = await Note.create(payload);

  res.status(201).json({
    success: true,
    data: note,
  });
});

// @desc    Update note
// @route   PUT /api/v1/notes/:id
exports.updateNote = asyncHandler(async (req, res, next) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  if (note.user && req.user && note.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this note', 401));
  }

  note = await Note.findByIdAndUpdate(req.params.id, req.body, {
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
exports.deleteNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  if (note.user && req.user && note.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this note', 401));
  }

  await note.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Archive note
// @route   PUT /api/v1/notes/:id/archive
exports.archiveNote = asyncHandler(async (req, res, next) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  if (note.user && req.user && note.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to archive this note', 401));
  }

  note = await Note.findByIdAndUpdate(req.params.id, { archived: true }, {
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
exports.unarchiveNote = asyncHandler(async (req, res, next) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  if (note.user && req.user && note.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to unarchive this note', 401));
  }

  note = await Note.findByIdAndUpdate(req.params.id, { archived: false }, {
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
exports.completeNote = asyncHandler(async (req, res, next) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  if (note.user && req.user && note.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to complete this note', 401));
  }

  note = await Note.findByIdAndUpdate(req.params.id, { completed: true }, {
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
exports.searchNotes = asyncHandler(async (req, res, next) => {
  const q = req.query.q || '';
  const regex = { $regex: q, $options: 'i' };

  let filter = {
    $or: [
      { title: regex },
      { content: regex },
      { category: regex },
      { tag: regex },
    ],
  };

  if (req.user) {
    filter = { $and: [{ user: req.user.id }, filter] };
  }

  const notes = await Note.find(filter);

  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes,
  });
});
