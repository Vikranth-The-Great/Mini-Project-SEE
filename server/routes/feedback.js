const express = require('express');
const Feedback = require('../models/Feedback');
const { protectAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/feedback  (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const feedback = await Feedback.create({ name, email, message });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/feedback  (admin only)
router.get('/', protectAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
