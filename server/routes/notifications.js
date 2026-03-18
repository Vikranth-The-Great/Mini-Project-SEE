const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

const router = express.Router();

const recipientQuery = (req) => ({
  $or: [
    { recipientRole: req.user.role, recipientId: req.user.id },
    // Legacy support for old donor notifications.
    ...(req.user.role === 'user' ? [{ userId: req.user.id }] : []),
  ],
});

// GET /api/notifications/my
router.get('/my', protect, async (req, res) => {
  try {
    const rows = await Notification.find(recipientQuery(req))
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const row = await Notification.findOne({ _id: req.params.id, ...recipientQuery(req) });
    if (!row) return res.status(404).json({ message: 'Notification not found' });

    row.isRead = true;
    await row.save();
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { ...recipientQuery(req), isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
