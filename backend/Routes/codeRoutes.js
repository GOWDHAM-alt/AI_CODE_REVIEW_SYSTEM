const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { submitCode, getHistory, getSingleReview, removeReview } = require('../controller/codeController');

// All routes here are protected (need login token)
router.post('/review', protect, submitCode);            // POST   /api/code/review
router.get('/history', protect, getHistory);            // GET    /api/code/history
router.get('/history/:id', protect, getSingleReview);   // GET    /api/code/history/1
router.delete('/history/:id', protect, removeReview);   // DELETE /api/code/history/1

module.exports = router;