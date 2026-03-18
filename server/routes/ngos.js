const express = require('express');
const FoodDonation = require('../models/FoodDonation');

const router = express.Router();

const hasDistributionWindow = (donation, now) => {
  if (!donation.distributionStartTime || !donation.distributionEndTime) return false;
  const start = new Date(donation.distributionStartTime);
  const end = new Date(donation.distributionEndTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
  return now >= start && now <= end;
};

// Public API: NGOs currently distributing food
// GET /api/ngos/food-availability
router.get('/food-availability', async (_req, res) => {
  try {
    const now = new Date();

    const rows = await FoodDonation.find({
      status: 'Delivered',
      assignedTo: { $ne: null },
      remainingMeals: { $gt: 0 },
      latitude: { $ne: null },
      longitude: { $ne: null },
    })
      .select('assignedTo latitude longitude address remainingMeals distributionStartTime distributionEndTime status')
      .populate('assignedTo', 'name address')
      .lean();

    const activeRows = rows.filter((row) => hasDistributionWindow(row, now));

    const grouped = new Map();

    for (const row of activeRows) {
      const ngo = row.assignedTo;
      if (!ngo || !ngo._id) continue;

      const key = String(ngo._id);
      const existing = grouped.get(key);

      if (!existing) {
        grouped.set(key, {
          ngoName: ngo.name,
          latitude: row.latitude,
          longitude: row.longitude,
          address: ngo.address || row.address,
          mealsRemaining: Number(row.remainingMeals) || 0,
          distributionStartTime: row.distributionStartTime,
          distributionEndTime: row.distributionEndTime,
        });
        continue;
      }

      existing.mealsRemaining += Number(row.remainingMeals) || 0;

      if (new Date(row.distributionStartTime) < new Date(existing.distributionStartTime)) {
        existing.distributionStartTime = row.distributionStartTime;
      }
      if (new Date(row.distributionEndTime) > new Date(existing.distributionEndTime)) {
        existing.distributionEndTime = row.distributionEndTime;
      }
    }

    res.json(Array.from(grouped.values()));
  } catch (err) {
    res.status(500).json({ message: err.message || 'Could not fetch food availability' });
  }
});

module.exports = router;
