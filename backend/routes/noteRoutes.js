// routes/noteRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
  completeNote,
  searchNotes,
} = require('../controllers/noteController');

const router = express.Router();

router.route('/').get(protect, getNotes).post(protect, createNote);
router.route('/:id').get(protect, getNote).put(protect, updateNote).delete(protect, deleteNote);
router.route('/:id/archive').put(protect, archiveNote);
router.route('/:id/unarchive').put(protect, unarchiveNote);
router.route('/:id/complete').put(protect, completeNote);
router.route('/search').get(protect, searchNotes);

module.exports = router;
