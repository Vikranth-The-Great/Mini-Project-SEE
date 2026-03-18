const express = require('express');
const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const Feedback = require('../models/Feedback');
const { protectAdmin } = require('../middleware/auth');

const router = express.Router();

const KG_TO_CO2_FACTOR = 2.5;
const KG_PER_MEAL = 0.5;

const parseQuantityToKg = (quantityText) => {
  const text = String(quantityText || '').toLowerCase().trim();
  const match = text.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;

  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return 0;

  if (text.includes('kg') || text.includes('kilogram')) return amount;
  if (text.includes('gram') || /\bg\b/.test(text)) return amount / 1000;
  if (text.includes('mg')) return amount / 1000000;
  if (text.includes('ton')) return amount * 1000;

  // Heuristic conversion for common serving-based entries.
  if (text.includes('plate') || text.includes('meal')) return amount * 0.45;
  if (text.includes('pack') || text.includes('packet') || text.includes('box') || text.includes('piece')) return amount * 0.35;

  // Fallback: treat plain numeric quantity as kilograms.
  return amount;
};

const getEnvironmentalImpact = async () => {
  const delivered = await FoodDonation.find({ deliveredAt: { $ne: null } }).select('quantity');
  const totalFoodSavedKg = Number(
    delivered.reduce((sum, row) => sum + parseQuantityToKg(row.quantity), 0).toFixed(2)
  );

  const totalCo2PreventedKg = Number((totalFoodSavedKg * KG_TO_CO2_FACTOR).toFixed(2));
  const mealsServedEquivalent = Math.round(totalFoodSavedKg / KG_PER_MEAL);

  return {
    totalFoodSavedKg,
    totalCo2PreventedKg,
    mealsServedEquivalent,
  };
};

// GET /api/analytics  (admin only)
router.get('/', protectAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalFeedbacks,
      totalDonations,
      totalDeliveredOrders,
      totalPendingOrders,
      maleCount,
      femaleCount,
    ] = await Promise.all([
      User.countDocuments(),
      Feedback.countDocuments(),
      FoodDonation.countDocuments(),
      FoodDonation.countDocuments({ deliveredAt: { $ne: null } }),
      FoodDonation.countDocuments({ deliveredAt: null }),
      User.countDocuments({ gender: 'male' }),
      User.countDocuments({ gender: 'female' }),
    ]);

    // Donations per location (top locations)
    const donationsByLocation = await FoodDonation.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const categoryStats = await FoodDonation.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const donationsPerDay = await FoodDonation.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const deliveryDaily = await FoodDonation.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          total: { $sum: 1 },
          delivered: {
            $sum: {
              $cond: [{ $ne: ['$deliveredAt', null] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const mostDonatedFoodCategory = categoryStats.length
      ? { category: categoryStats[0]._id, count: categoryStats[0].count }
      : null;

    const environmentalImpact = await getEnvironmentalImpact();

    res.json({
      totalUsers,
      totalFeedbacks,
      totalDonations,
      totalDeliveredOrders,
      totalPendingOrders,
      mostDonatedFoodCategory,
      genderStats: { male: maleCount, female: femaleCount },
      donationsByLocation: donationsByLocation.map((d) => ({
        location: d._id,
        count: d.count,
      })),
      donationsPerDay: donationsPerDay.map((d) => ({ date: d._id, count: d.count })),
      categoryDistribution: categoryStats.map((d) => ({ category: d._id, count: d.count })),
      deliverySuccessRate: deliveryDaily.map((d) => ({
        date: d._id,
        delivered: d.delivered,
        total: d.total,
        rate: d.total ? Number(((d.delivered / d.total) * 100).toFixed(2)) : 0,
      })),
      environmentalImpact,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/environment-impact  (admin only)
router.get('/environment-impact', protectAdmin, async (_req, res) => {
  try {
    const impact = await getEnvironmentalImpact();
    res.json(impact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
